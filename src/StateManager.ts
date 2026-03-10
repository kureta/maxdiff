import { DiffPresenter, RenderModel, MetadataDiff } from "./DiffPresenter.js";
import { MaxDiff, MaxPatch, AnnotatedMaxPatch, Patcher } from "./DiffEngine.js";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ViewMode = "diff" | "before" | "after";
export type StateChangeType =
  | "data"
  | "navigation"
  | "view"
  | "zoom"
  | "layout-reset";
export interface StateChangeEvent {
  readonly type: StateChangeType;
  readonly pivot?: { x: number; y: number };
}

interface NavEntry {
  readonly patchA: MaxPatch | null;
  readonly patchB: MaxPatch | null;
}

// ─── Empty Patch Fallback ─────────────────────────────────────────────────────
const EMPTY: MaxPatch = {
  patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] },
};
function safe(patch: MaxPatch | null): MaxPatch {
  return patch ?? EMPTY;
}

// ─── StateManager ─────────────────────────────────────────────────────────────
export class StateManager extends EventTarget {
  #patchA: MaxPatch | null = null;
  #patchB: MaxPatch | null = null;
  #annotated: AnnotatedMaxPatch = {
    patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] },
  };

  #models: Record<ViewMode, RenderModel> = {
    diff: { boxes: [], lines: [] },
    before: { boxes: [], lines: [] },
    after: { boxes: [], lines: [] },
  };

  #metadataDiffs: readonly MetadataDiff[] = [];
  #navStack: NavEntry[] = [];

  zoomLevel = 1.0;
  viewMode: ViewMode = "diff";
  isPresentation = false;
  showRemovedPresentation = false;

  // ── Accessors ───────────────────────────────────────────────────────────────
  get renderModel(): RenderModel {
    return this.#models[this.viewMode];
  }

  get metadata(): {
    diffs: readonly MetadataDiff[];
    values: Readonly<Record<string, unknown>>;
  } {
    if (this.viewMode === "diff")
      return { diffs: this.#metadataDiffs, values: {} };
    const patch = this.viewMode === "before" ? this.#patchA : this.#patchB;
    return { diffs: [], values: DiffPresenter.metadata(patch ?? undefined) };
  }

  get hasParent(): boolean {
    return this.#navStack.length > 0;
  }

  // ── Data Setters ────────────────────────────────────────────────────────────
  setFileA(data: MaxPatch): void {
    this.#patchA = data;
    this.#recalculate();
  }
  setFileB(data: MaxPatch): void {
    this.#patchB = data;
    this.#recalculate();
  }

  setInitialData(patchA: MaxPatch, patchB: MaxPatch): void {
    this.#patchA = patchA;
    this.#patchB = patchB;
    this.#recalculate();
  }

  // ── View Controls ───────────────────────────────────────────────────────────
  setZoom(level: number, pivot?: { x: number; y: number }): void {
    const clamped = Math.max(0.2, Math.min(level, 3.0));
    if (clamped === this.zoomLevel) return;
    this.zoomLevel = clamped;
    this.#notify("zoom", pivot ? { pivot } : {});
  }

  setViewMode(mode: ViewMode): void {
    if (this.viewMode === mode) return;
    this.viewMode = mode;
    this.#notify("view");
  }

  togglePresentation(active: boolean): void {
    if (this.isPresentation === active) return;
    this.isPresentation = active;
    this.#notify("view");
  }

  toggleShowRemovedPresentation(active: boolean): void {
    if (this.showRemovedPresentation === active) return;
    this.showRemovedPresentation = active;
    this.#notify("view");
  }

  resetLayout(): void {
    this.zoomLevel = 1.0;
    this.#recalculate("layout-reset");
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  enterSubpatch(boxId: string): void {
    const actualId = boxId.replace("_removed", "");
    const [pA, pB] = this.#resolveSubpatch(actualId);
    if (pA || pB) this.#pushSubpatch(pA, pB);
  }

  popSubpatch(): void {
    const prev = this.#navStack.pop();
    if (!prev) return;
    this.#patchA = prev.patchA;
    this.#patchB = prev.patchB;
    this.#recalculate();
  }

  // ── Private ─────────────────────────────────────────────────────────────────
  #resolveSubpatch(id: string): [Patcher | undefined, Patcher | undefined] {
    for (const { box } of this.#annotated.patcher.boxes) {
      const diff = box._diff;
      if (!diff) {
        if (box.id === id) return [box.patcher, box.patcher];
      } else if (diff.type === "deleted") {
        if (diff.previous?.id === id) return [diff.previous.patcher, undefined];
      } else if (diff.type === "added") {
        if (box.id === id) return [undefined, box.patcher];
      } else {
        // modified or moved
        if (box.id === id || diff.previous?.id === id)
          return [diff.previous?.patcher, box.patcher];
      }
    }
    // Fallback: look in raw patches
    const boxA = this.#patchA?.patcher.boxes.find((b) => b.box.id === id)?.box;
    const boxB = this.#patchB?.patcher.boxes.find((b) => b.box.id === id)?.box;
    return [boxA?.patcher, boxB?.patcher];
  }

  #pushSubpatch(pA: Patcher | undefined, pB: Patcher | undefined): void {
    this.#navStack.push({ patchA: this.#patchA, patchB: this.#patchB });
    this.#patchA = pA ? { patcher: pA } : null;
    this.#patchB = pB ? { patcher: pB } : null;
    this.#recalculate("navigation");
  }

  #recalculate(eventType: StateChangeType = "data"): void {
    const a = safe(this.#patchA);
    const b = safe(this.#patchB);

    this.#annotated = MaxDiff.annotate(a, b);

    this.#models = {
      diff: DiffPresenter.renderDiff(this.#annotated),
      before: DiffPresenter.render(this.#patchA ?? undefined),
      after: DiffPresenter.render(this.#patchB ?? undefined),
    };

    this.#metadataDiffs = DiffPresenter.compareMetadata(
      this.#patchA ?? undefined,
      this.#patchB ?? undefined,
    );
    this.#notify(eventType);
  }

  #notify(type: StateChangeType, extras: Partial<StateChangeEvent> = {}): void {
    this.dispatchEvent(
      new CustomEvent<StateChangeEvent>("state-change", {
        detail: { type, ...extras },
      }),
    );
  }
}
