/**
 * Logic for calculating differences between two Max/MSP patches.
 */

// TODO: Show `id` and `maxclass` on hover.
// Matching scores
const same_class = 4;
const same_num_inlets_outlets = 2;
const max_connection_score = 8;
const similar_rectangles = 1;
const threshold = 8;

export class DiffEngine {
  /**
   * Extracts and normalizes patcher data.
   * @param {Object} data - Raw patcher JSON data.
   * @returns {{boxes: Array, lines: Array, metadata: Object}}
   */
  static normalize(data) {
    const patcher = data?.patcher ?? {};
    const { boxes, lines, ...metadata } = patcher;
    return {
      boxes: (boxes ?? []).map((item) => {
        const box = structuredClone(item.box);
        if (box.numinlets === undefined) box.numinlets = 0;
        if (box.numoutlets === undefined) box.numoutlets = 0;
        return box;
      }),
      lines: (lines ?? []).map((item) => structuredClone(item.patchline)),
      metadata,
    };
  }

  /**
   * Determines the functional class of a Max object.
   * Only UI objects have a `maxclass` other than `newobj`.
   * For `newobj` types, the first word of the `text` attribute is used as the class name.
   * @param {Object} box - The box object from the patcher JSON.
   * @returns {string} The class name or object type.
   */
  static getClass(box) {
    if (box.maxclass && box.maxclass !== "newobj") return box.maxclass;
    return (box.text || "").split(" ")[0];
  }

  /**
   * Compares two patcher datasets.
   * @param {Object} dataA - Old patcher data.
   * @param {Object} dataB - New patcher data.
   * @returns {{boxes: Array, lines: Array, metadata: Object}}
   */
  static compare(dataA, dataB) {
    const {
      boxes: boxesA,
      lines: linesA,
      metadata: metadataA,
    } = this.normalize(dataA);
    const {
      boxes: boxesB,
      lines: linesB,
      metadata: metadataB,
    } = this.normalize(dataB);

    // TODO: I think we should have an internal id for objects.
    //  Go full object oriented. There are 3 types of boxes.
    //  * Only in old data (deleted)
    //  * Only in new date (added)
    //  * Part of a matched pair (modified)
    //      * This has subtypes (changed, moved/resized)
    // To be able to select boxB by id
    const mapA = new Map(boxesA.map((b) => [b.id, b]));
    const mapB = new Map(boxesB.map((b) => [b.id, b]));

    // --- Pass 1: Anchors ---
    // Find all objects where id and maxclass match.

    // all boxA mapped to matching boxB
    // If this has key boxA, it means that boxA is matched.
    const matchesAtoB = new Map();
    const matchesBtoA = new Map();
    // For the inverse query, if this has item boxB.id, it means that boxB is matched.
    const matchedBIds = new Set();
    const idsAtoB = new Map();
    const idsBtoA = new Map();

    for (const boxA of boxesA) {
      // Get boxB with the same id as boxA.
      const boxB = mapB.get(boxA.id);
      // If it exists and has the same class as boxA, match them.
      if (boxB) {
        const [classA, classB] = [this.getClass(boxA), this.getClass(boxB)];
        if (classA === classB) {
          matchesAtoB.set(boxA, boxB);
          matchesBtoA.set(boxB, boxA);
          matchedBIds.add(boxB.id);

          idsAtoB.set(boxA.id, boxB.id);
          idsBtoA.set(boxB.id, boxA.id);
        }
      }
    }

    // The matches above are our anchors
    // TODO:
    //  If any of the remaining boxes are connected to anchors in the exact same way;
    //  add them as anchors. Do this again until there are no boxes with the same connections to the anchors.
    //  Then add boxes that have at least one shared connection to the same anchor as anchors.
    //  Then, calculate similarity scores of the remaining boxes (this might not be necessary).
    //  The rest of the old boxes are deleted, and new boxes are added.

    // --- Pass 2: Relational ---
    const unmatchedA = boxesA.filter((box) => !matchesAtoB.has(box));
    const unmatchedB = boxesB.filter((box) => !matchesBtoA.has(box));

    const matchedPercent = (matchedBIds.size / boxesB.length) * 100;
    console.debug(
      `Matched ${matchedPercent.toFixed(1)}% of the new boxes as "Anchors".`,
    );

    const adjA = this.buildDirectedAdjacency(linesA);
    const adjB = this.buildDirectedAdjacency(linesB);

    // Map of matched IDs for connection scoring (Old ID -> New ID)
    const anchorMap = new Map();
    for (const [a, b] of matchesAtoB) {
      anchorMap.set(a.id, b.id);
    }

    const candidates = [];

    for (const boxA of unmatchedA) {
      for (const boxB of unmatchedB) {
        const score = this.calculateSimilarity(
          boxA,
          boxB,
          adjA,
          adjB,
          idsAtoB,
          idsBtoA,
        );
        candidates.push({ boxA, boxB, score });
      }
    }

    // Greedy matching
    candidates.sort((a, b) => b.score - a.score);

    for (const { boxA, boxB, score } of candidates) {
      if (matchesAtoB.has(boxA) || matchedBIds.has(boxB.id)) continue;

      if (score >= threshold) {
        matchesAtoB.set(boxA, boxB);
        matchedBIds.add(boxB.id);
      }
    }

    // --- Generate Box Diffs ---
    const diffBoxes = [];
    const ignoredAttrs = new Set([
      "id",
      "patching_rect",
      "text",
      "maxclass",
      "presentation_rect",
      "rect",
    ]);
    const hardIgnored = new Set(["patcher"]);

    for (const [boxA, boxB] of matchesAtoB) {
      const allDiffs = this.compareObjects(boxA, boxB, "", hardIgnored);
      const attrDiffs = [];
      const ignoredDiffs = [];

      for (const d of allDiffs) {
        const topKey = d.key.split(".")[0];
        if (ignoredAttrs.has(topKey)) {
          ignoredDiffs.push(d);
        } else {
          attrDiffs.push(d);
        }
      }

      const textA = boxA.text ?? boxA.maxclass;
      const textB = boxB.text ?? boxB.maxclass;

      let isContentModified =
        textA !== textB ||
        attrDiffs.length > 0 ||
        boxA.presentation !== boxB.presentation ||
        !this.isRectEqual(boxA.presentation_rect, boxB.presentation_rect);

      if (!isContentModified) {
        if (JSON.stringify(boxA.patcher) !== JSON.stringify(boxB.patcher)) {
          isContentModified = true;
        }
      }

      const isPositionOrSizeModified = !this.isRectEqual(
        boxA.patching_rect,
        boxB.patching_rect,
      );
      const diffState = isContentModified
        ? "modified"
        : isPositionOrSizeModified
          ? "moved"
          : "unchanged";

      diffBoxes.push({
        ...boxB,
        id: boxB.id,
        originalId: boxA.id,
        diffState,
        patcherA: boxA.patcher,
        patcherB: boxB.patcher,
        oldText: textA,
        attrDiffs,
        ignoredDiffs,
      });
    }

    for (const boxA of unmatchedA) {
      if (!matchesAtoB.has(boxA)) {
        diffBoxes.push({
          ...boxA,
          id: boxA.id + "_removed",
          originalId: boxA.id,
          diffState: "removed",
          patcherA: boxA.patcher,
          patcherB: null,
        });
      }
    }

    for (const boxB of unmatchedB) {
      if (!matchedBIds.has(boxB.id)) {
        diffBoxes.push({
          ...boxB,
          diffState: "added",
          patcherA: null,
          patcherB: boxB.patcher,
        });
      }
    }

    // --- Generate Line Diffs ---
    const idMapAtoB = new Map();
    for (const [boxA, boxB] of matchesAtoB) {
      idMapAtoB.set(boxA.id, boxB.id);
    }

    const getLineKey = (src, dst) => `${src.join(",")}-${dst.join(",")}`;
    const linesMapB = new Map();
    for (const l of linesB) {
      linesMapB.set(getLineKey(l.source, l.destination), l);
    }

    const diffLines = [];
    const processedLinesB = new Set();
    const getOutputIdForA = (id) =>
      idMapAtoB.has(id) ? idMapAtoB.get(id) : id + "_removed";

    for (const lA of linesA) {
      const srcId = lA.source[0];
      const dstId = lA.destination[0];
      const mappedSrc = idMapAtoB.get(srcId);
      const mappedDst = idMapAtoB.get(dstId);

      if (mappedSrc !== undefined && mappedDst !== undefined) {
        const keyInB = getLineKey(
          [mappedSrc, lA.source[1]],
          [mappedDst, lA.destination[1]],
        );
        const lB = linesMapB.get(keyInB);

        if (lB) {
          diffLines.push({ ...lB, diffState: "unchanged" });
          processedLinesB.add(keyInB);
          continue;
        }
      }

      const line = {
        ...lA,
        source: [...lA.source],
        destination: [...lA.destination],
        diffState: "removed",
      };
      line.source[0] = getOutputIdForA(srcId);
      line.destination[0] = getOutputIdForA(dstId);
      diffLines.push(line);
    }

    for (const [key, lB] of linesMapB) {
      if (!processedLinesB.has(key)) {
        diffLines.push({ ...lB, diffState: "added" });
      }
    }

    return { boxes: diffBoxes, lines: diffLines };
  }

  // TODO: Understand this
  static buildAdjacency(lines) {
    const adj = new Map();
    for (const l of lines) {
      const src = l.source[0];
      const dst = l.destination[0];
      if (!adj.has(src)) adj.set(src, new Set());
      if (!adj.has(dst)) adj.set(dst, new Set());
      adj.get(src).add(dst);
      adj.get(dst).add(src);
    }
    return adj;
  }

  static buildDirectedAdjacency(lines) {
    const linesGoingOut = new Map();
    const linesComingIn = new Map();
    for (const l of lines) {
      // TODO: Is the exact pin important? Source/destination are pairs of object/pin
      //  If pins are important, use the tuple, not just the object.
      const src = l.source[0];
      const dst = l.destination[0];
      if (!linesGoingOut.has(src)) linesGoingOut.set(src, []);
      if (!linesComingIn.has(dst)) linesComingIn.set(dst, []);
      linesGoingOut.get(src).push(dst);
      linesComingIn.get(dst).push(src);
    }

    return { linesGoingOut, linesComingIn };
  }

  // TODO: Count shared connections to anchors
  /**
   * Calculates connection similarity score.
   * @param {{Map, Map}} connA - Old connections.
   * @param {{Map, Map}} connB - New connections.
   * @param {Map} idsAtoB - id Map from A to B.
   * @param {Map} idsBtoA - id Map from B to A.
   * @returns {{boxes: Array, lines: Array, metadata: Object}}
   */
  static connectionScore(connA, connB, idsAtoB, idsBtoA) {
    if (!connA || !connB) return 0;
    console.log("We are here");
    const anchorConnA = new Set(connA.filter((id) => idsAtoB.has(id)));
    const anchorConnB = new Set(connB.filter((id) => idsBtoA.has(id)));
    const intersection = anchorConnA.intersection(anchorConnB).size;
    const union = anchorConnA.union(anchorConnB).size;
    if (intersection === 0 || union === 0) return 0;
    return intersection / union;
  }

  static calculateSimilarity(boxA, boxB, adjA, adjB, idsAtoB, idsBtoA) {
    let score = 0;
    // Same effective class
    if (this.getClass(boxA) === this.getClass(boxB)) score += same_class;
    // Patching rectangles overlap
    if (this.getIoM(boxA.patching_rect, boxB.patching_rect) > 0.8)
      score += similar_rectangles;
    // Same number of inlets and outlets
    if (
      boxA.numinlets === boxB.numinlets &&
      boxA.numoutlets === boxB.numoutlets
    )
      score += same_num_inlets_outlets;

    // Number of connections matching
    const fromBoxA = adjA.linesGoingOut.get(boxA.id);
    const toBoxA = adjA.linesComingIn.get(boxA.id);
    const fromBoxB = adjB.linesGoingOut.get(boxB.id);
    const toBoxB = adjB.linesComingIn.get(boxB.id);

    console.log(fromBoxA, toBoxA, fromBoxB, toBoxB);

    const outGoing = this.connectionScore(fromBoxA, fromBoxB, idsAtoB, idsBtoA);
    const inComing = this.connectionScore(toBoxA, toBoxB, idsAtoB, idsBtoA);

    score += (max_connection_score * (outGoing + inComing)) / 2;

    return score;
  }

  // Intersection over Minimum
  static getIoM(r1, r2) {
    if (!r1 || !r2) return 0;
    const x1 = Math.max(r1[0], r2[0]);
    const y1 = Math.max(r1[1], r2[1]);
    const x2 = Math.min(r1[0] + r1[2], r2[0] + r2[2]);
    const y2 = Math.min(r1[1] + r1[3], r2[1] + r2[3]);

    if (x2 <= x1 || y2 <= y1) return 0;

    const intersection = (x2 - x1) * (y2 - y1);
    const area1 = r1[2] * r1[3];
    const area2 = r2[2] * r2[3];

    if (area1 <= 0 || area2 <= 0) return 0;
    return intersection / Math.min(area1, area2);
  }

  static isRectEqual(r1, r2) {
    if (r1 === r2) return true;
    if (!r1 || !r2) return false;
    return (
      r1[0] === r2[0] && r1[1] === r2[1] && r1[2] === r2[2] && r1[3] === r2[3]
    );
  }

  /**
   * Recursively compares two objects and returns a list of differences.
   */
  static compareObjects(objA, objB, path = "", ignored = new Set()) {
    const diffs = [];
    const keysA = Object.keys(objA ?? {});
    const keysB = Object.keys(objB ?? {});
    const allKeys = new Set([...keysA, ...keysB]);

    for (const key of allKeys) {
      if (ignored.has(key)) continue;

      const valA = objA?.[key];
      const valB = objB?.[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (valA === valB) continue;

      const isObjA = this.isObject(valA);
      const isObjB = this.isObject(valB);

      if (isObjA && isObjB) {
        diffs.push(...this.compareObjects(valA, valB, currentPath, ignored));
      } else {
        if (JSON.stringify(valA) !== JSON.stringify(valB)) {
          diffs.push({ key: currentPath, old: valA, new: valB });
        }
      }
    }
    return diffs;
  }

  static isObject(val) {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }

  static getMetadata(data) {
    const { boxes, lines, ...metadata } = data?.patcher ?? {};
    return metadata;
  }

  static compareMetadata(dataA, dataB) {
    if (!dataA?.patcher || !dataB?.patcher) return [];
    return this.compareObjects(
      dataA.patcher,
      dataB.patcher,
      "",
      new Set(["boxes", "lines", "rect"]),
    );
  }
}
