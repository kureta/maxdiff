// ─── Pure Helper ─────────────────────────────────────────────────────────────

/** Returns the semantic class of a box — the maxclass, or the first token of text for generic objects. */
export function boxClass(box) {
  return box.maxclass !== "newobj"
    ? box.maxclass
    : ((box.text ?? "").split(" ")[0] ?? "");
}

// ─── Matching Passes ──────────────────────────────────────────────────────────

/** Pass 1: Match by identical ID and identical class. */
function matchById(mapA, mapB) {
  const pairs = [];
  const anchoredA = new Set();
  const anchoredB = new Set();

  for (const [id, boxA] of mapA) {
    const boxB = mapB.get(id);
    if (boxB && boxClass(boxA) === boxClass(boxB)) {
      pairs.push([boxA, boxB]);
      anchoredA.add(id);
      anchoredB.add(id);
    }
  }
  return { pairs, anchoredA, anchoredB };
}

/** Pass 1.5: Among unmatched boxes, match where a class appears exactly once on each side. */
function matchByUniqueClass(mapA, mapB, anchoredA, anchoredB, pairs) {
  const uniqA = uniqueClassMap(mapA, anchoredA);
  const uniqB = uniqueClassMap(mapB, anchoredB);

  for (const [cls, boxA] of uniqA) {
    const boxB = uniqB.get(cls);
    if (!boxB) continue;
    pairs.push([boxA, boxB]);
    anchoredA.add(boxA.id);
    anchoredB.add(boxB.id);
  }
}

function uniqueClassMap(map, exclude) {
  const seen = new Map();
  for (const [id, box] of map) {
    if (exclude.has(id)) continue;
    const cls = boxClass(box);
    seen.set(cls, seen.has(cls) ? null : box);
  }
  const unique = new Map();
  for (const [cls, box] of seen) {
    if (box !== null) unique.set(cls, box);
  }
  return unique;
}

/** Pass 2: Match unanchored boxes by their topological signature relative to already-anchored neighbours. */
function matchByTopology(
  mapA,
  mapB,
  linesA,
  linesB,
  anchoredA,
  anchoredB,
  pairs,
) {
  const sigA = buildSignatureMap(mapA, linesA, anchoredA);
  const sigB = buildSignatureMap(mapB, linesB, anchoredB);

  for (const [idA, [sig, boxA]] of sigA) {
    if (!sig) continue;
    for (const [idB, [sigBVal, boxB]] of sigB) {
      if (boxClass(boxA) !== boxClass(boxB) || sig !== sigBVal) continue;
      pairs.push([boxA, boxB]);
      anchoredA.add(idA);
      anchoredB.add(idB);
      sigB.delete(idB);
      break;
    }
  }
}

function buildSignatureMap(map, lines, anchored) {
  const result = new Map();
  for (const [id, box] of map) {
    if (anchored.has(id)) continue;
    const tokens = [];
    for (const { source, destination } of lines) {
      if (destination[0] === id && anchored.has(source[0]))
        tokens.push(`in:${destination[1]}<-${source[0]}:${source[1]}`);
      if (source[0] === id && anchored.has(destination[0]))
        tokens.push(`out:${source[1]}->${destination[0]}:${destination[1]}`);
    }
    result.set(id, [tokens.sort().join("|"), box]);
  }
  return result;
}

// ─── Field Diffing ───────────────────────────────────────────────────────────

const POSITION_KEYS = new Set(["patching_rect", "presentation_rect", "rect"]);

function diffFields(boxA, boxB) {
  const fields = {};
  const keys = new Set([...Object.keys(boxA), ...Object.keys(boxB)]);
  keys.delete("id");

  for (const key of keys) {
    if (JSON.stringify(boxA[key]) !== JSON.stringify(boxB[key]))
      fields[key] = { from: boxA[key], to: boxB[key] };
  }
  return fields;
}

// ─── Line Key Helper ─────────────────────────────────────────────────────────

function lineKey(src, dst) {
  return `${src[0]},${src[1]}-${dst[0]},${dst[1]}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class MaxDiff {
  /** Produce an annotated version of patchB containing all diff information inline. */
  static annotate(patchA, patchB) {
    const boxesA = patchA.patcher.boxes.map((b) => b.box);
    const boxesB = patchB.patcher.boxes.map((b) => b.box);
    const linesA = patchA.patcher.lines?.map((l) => l.patchline) ?? [];
    const linesB = patchB.patcher.lines?.map((l) => l.patchline) ?? [];

    const mapA = new Map(boxesA.map((b) => [b.id, b]));
    const mapB = new Map(boxesB.map((b) => [b.id, b]));

    const { pairs, anchoredA, anchoredB } = matchById(mapA, mapB);
    matchByUniqueClass(mapA, mapB, anchoredA, anchoredB, pairs);
    matchByTopology(mapA, mapB, linesA, linesB, anchoredA, anchoredB, pairs);

    // Build A-id → B-id map for all matched pairs.
    const idMapAtoB = new Map();
    // Build B-id → A-side box map for annotating B-side boxes.
    const pairByBId = new Map();
    for (const [boxA, boxB] of pairs) {
      idMapAtoB.set(boxA.id, boxB.id);
      pairByBId.set(boxB.id, boxA);
    }

    // Build annotated boxes: B-side first, then deleted A-side boxes.
    const annotatedBoxes = [];
    for (const boxB of boxesB) {
      const boxA = pairByBId.get(boxB.id);
      if (!boxA) {
        annotatedBoxes.push({ box: { ...boxB, _diff: { type: "added" } } });
      } else {
        const fields = diffFields(boxA, boxB);
        if (Object.keys(fields).length === 0) {
          annotatedBoxes.push({ box: boxB });
        } else {
          const isPositionOnly = Object.keys(fields).every((k) =>
            POSITION_KEYS.has(k),
          );
          annotatedBoxes.push({
            box: {
              ...boxB,
              _diff: {
                type: isPositionOnly ? "moved" : "modified",
                previous: boxA,
                fields,
              },
            },
          });
        }
      }
    }
    for (const [id, boxA] of mapA) {
      if (!anchoredA.has(id)) {
        annotatedBoxes.push({
          box: {
            ...boxA,
            id: `${boxA.id}_removed`,
            _diff: { type: "deleted", previous: boxA },
          },
        });
      }
    }

    // Annotate lines.
    const linesMapB = new Map(
      linesB.map((l) => [lineKey(l.source, l.destination), l]),
    );
    const processedB = new Set();
    const annotatedLines = [];

    for (const lA of linesA) {
      const mappedSrc =
        idMapAtoB.get(lA.source[0]) ?? `${lA.source[0]}_removed`;
      const mappedDst =
        idMapAtoB.get(lA.destination[0]) ?? `${lA.destination[0]}_removed`;
      const key = lineKey(
        [mappedSrc, lA.source[1]],
        [mappedDst, lA.destination[1]],
      );
      const lB = linesMapB.get(key);
      if (lB) {
        processedB.add(key);
        annotatedLines.push({ patchline: lB });
      } else {
        annotatedLines.push({
          patchline: {
            source: [mappedSrc, lA.source[1]],
            destination: [mappedDst, lA.destination[1]],
            _diff: { type: "removed" },
          },
        });
      }
    }
    for (const [key, lB] of linesMapB) {
      if (!processedB.has(key))
        annotatedLines.push({ patchline: { ...lB, _diff: { type: "added" } } });
    }

    return {
      patcher: {
        ...patchB.patcher,
        boxes: annotatedBoxes,
        lines: annotatedLines,
      },
    };
  }
}
