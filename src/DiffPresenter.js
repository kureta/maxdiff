// ─── Constants ────────────────────────────────────────────────────────────────

/** Box attributes excluded from user-visible diffs (handled separately or noise). */
const HIDDEN_ATTR_KEYS = new Set([
  "patcher",
  "patching_rect",
  "presentation_rect",
  "rect",
]);

/** Patch-level keys excluded from metadata comparison. */
const HIDDEN_META_KEYS = new Set(["boxes", "lines", "rect"]);

// ─── Box View Model Helpers ───────────────────────────────────────────────────

function attrDiffsFor(box) {
  if (!box._diff?.fields) return [];
  return Object.entries(box._diff.fields)
    .filter(([key]) => !HIDDEN_ATTR_KEYS.has(key))
    .map(([key, delta]) => ({ key, old: delta.from, new: delta.to }));
}

function annotatedBoxToViewModel(box) {
  const diff = box._diff;
  if (!diff) {
    return {
      ...box,
      diffState: "unchanged",
      patcherA: box.patcher,
      patcherB: box.patcher,
    };
  }
  switch (diff.type) {
    case "added":
      return {
        ...box,
        diffState: "added",
        patcherA: null,
        patcherB: box.patcher,
      };
    case "deleted":
      return {
        ...box,
        diffState: "removed",
        patcherA: diff.previous?.patcher,
        patcherB: null,
      };
    case "moved":
    case "modified":
      return {
        ...box,
        diffState: diff.type,
        attrDiffs: attrDiffsFor(box),
        patcherA: diff.previous?.patcher,
        patcherB: box.patcher,
        ...(diff.previous && {
          oldText: diff.previous.text ?? diff.previous.maxclass,
        }),
      };
    default:
      throw new Error(`Unknown diff type: ${diff.type}`);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class DiffPresenter {
  /** Render an annotated diff patch. */
  static render(annotated) {
    const boxes = annotated.patcher.boxes.map((b) =>
      annotatedBoxToViewModel(b.box),
    );
    const lines = annotated.patcher.lines.map((l) => ({
      source: l.patchline.source,
      destination: l.patchline.destination,
      diffState: l.patchline._diff?.type ?? "unchanged",
    }));
    return structuredClone({ boxes, lines });
  }

  /** Extract patch-level metadata (everything except boxes, lines, rect). */
  static metadata(patch) {
    if (!patch?.patcher) return {};
    return Object.fromEntries(
      Object.entries(patch.patcher).filter(([k]) => !HIDDEN_META_KEYS.has(k)),
    );
  }

  /** Compare patch-level metadata between two patches. */
  static compareMetadata(patchA, patchB) {
    const metaA = this.metadata(patchA);
    const metaB = this.metadata(patchB);
    const keys = new Set([...Object.keys(metaA), ...Object.keys(metaB)]);
    return [...keys]
      .filter((k) => JSON.stringify(metaA[k]) !== JSON.stringify(metaB[k]))
      .map((k) => ({ key: k, old: metaA[k], new: metaB[k] }));
  }
}
