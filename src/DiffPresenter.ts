import { AnnotatedBox, AnnotatedMaxPatch, MaxPatch } from "./DiffEngine.js";
import { AttrDiff, BoxViewModel, LineViewModel } from "./components.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RenderModel {
  readonly boxes: readonly BoxViewModel[];
  readonly lines: readonly LineViewModel[];
}

export interface MetadataDiff {
  readonly key: string;
  readonly old?: unknown;
  readonly new?: unknown;
}

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

// ─── Empty Patch Fallback ─────────────────────────────────────────────────────

const EMPTY_PATCH: MaxPatch = {
  patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] },
};

function safe(patch: MaxPatch | undefined): MaxPatch {
  return patch?.patcher ? patch : EMPTY_PATCH;
}

// ─── Box View Model Helpers ───────────────────────────────────────────────────

function attrDiffsFor(box: AnnotatedBox): readonly AttrDiff[] {
  if (!box._diff?.fields) return [];
  return Object.entries(box._diff.fields)
    .filter(([key]) => !HIDDEN_ATTR_KEYS.has(key))
    .map(([key, delta]) => ({ key, old: delta.from, new: delta.to }));
}

function annotatedBoxToViewModel(box: AnnotatedBox): BoxViewModel {
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
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export class DiffPresenter {
  /** Render a plain (non-diff) patch with no change annotations. Used for before/after views. */
  static render(patch: MaxPatch | undefined): RenderModel {
    const p = safe(patch);
    const boxes: BoxViewModel[] = p.patcher.boxes.map((b) => ({ ...b.box }));
    const lines: LineViewModel[] = (p.patcher.lines ?? []).map((l) => ({
      source: l.patchline.source,
      destination: l.patchline.destination,
    }));
    return { boxes: structuredClone(boxes), lines: structuredClone(lines) };
  }

  /** Render an annotated diff patch. */
  static renderDiff(annotated: AnnotatedMaxPatch): RenderModel {
    const boxes: BoxViewModel[] = annotated.patcher.boxes.map((b) =>
      annotatedBoxToViewModel(b.box),
    );
    const lines: LineViewModel[] = annotated.patcher.lines.map((l) => ({
      source: l.patchline.source,
      destination: l.patchline.destination,
      diffState: l.patchline._diff
        ? l.patchline._diff.type === "removed"
          ? "removed"
          : "added"
        : "unchanged",
    }));
    return { boxes: structuredClone(boxes), lines: structuredClone(lines) };
  }

  /** Extract patch-level metadata (everything except boxes, lines, rect). */
  static metadata(
    patch: MaxPatch | undefined,
  ): Readonly<Record<string, unknown>> {
    if (!patch?.patcher) return {};
    return Object.fromEntries(
      Object.entries(patch.patcher).filter(([k]) => !HIDDEN_META_KEYS.has(k)),
    );
  }

  /** Compare patch-level metadata between two patches. */
  static compareMetadata(
    patchA: MaxPatch | undefined,
    patchB: MaxPatch | undefined,
  ): readonly MetadataDiff[] {
    const metaA = this.metadata(patchA);
    const metaB = this.metadata(patchB);
    const keys = new Set([...Object.keys(metaA), ...Object.keys(metaB)]);

    return [...keys]
      .filter((k) => JSON.stringify(metaA[k]) !== JSON.stringify(metaB[k]))
      .map((k) => ({ key: k, old: metaA[k], new: metaB[k] }));
  }
}
