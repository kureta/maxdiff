import { DiffPresenter } from "./DiffPresenter.js";
import { annotate } from "./DiffEngine.js";

// ─── Empty Patch Fallback ─────────────────────────────────────────────────────

const EMPTY = { patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] } };

function safe(patch) {
  return patch ?? EMPTY;
}

// ─── StateManager ─────────────────────────────────────────────────────────────

export class StateManager extends EventTarget {
  #patchA = null;
  #patchB = null;
  #annotated = EMPTY;

  #models = {
    diff: { boxes: [], lines: [] },
    before: { boxes: [], lines: [] },
    after: { boxes: [], lines: [] },
  };

  #metadataDiffs = [];
  #navStack = [];

  #zoomLevel = 1.0;
  #viewMode = "diff";
  #isPresentation = false;
  #showRemovedPresentation = false;

  // ── Getters ─────────────────────────────────────────────────────────────────

  get zoomLevel() {
    return this.#zoomLevel;
  }
  get viewMode() {
    return this.#viewMode;
  }
  get isPresentation() {
    return this.#isPresentation;
  }
  get showRemovedPresentation() {
    return this.#showRemovedPresentation;
  }

  get renderModel() {
    return this.#models[this.#viewMode];
  }

  get metadata() {
    if (this.#viewMode === "diff")
      return { diffs: this.#metadataDiffs, values: {} };
    const patch = this.#viewMode === "before" ? this.#patchA : this.#patchB;
    return { diffs: [], values: DiffPresenter.metadata(patch) };
  }

  get hasParent() {
    return this.#navStack.length > 0;
  }

  // ── Data Setters ────────────────────────────────────────────────────────────

  setFileA(data) {
    this.#patchA = safe(data);
    this.#recalculate();
  }
  setFileB(data) {
    this.#patchB = safe(data);
    this.#recalculate();
  }
  setInitialData(patchA, patchB) {
    this.#patchA = safe(patchA);
    this.#patchB = safe(patchB);
    this.#recalculate();
  }

  // ── View Controls ───────────────────────────────────────────────────────────

  setZoom(level, pivot) {
    const clamped = Math.max(0.2, Math.min(level, 3.0));
    if (clamped === this.#zoomLevel) return;
    this.#zoomLevel = clamped;
    this.#notify("zoom", pivot);
  }

  setViewMode(mode) {
    if (this.#viewMode === mode) return;
    this.#viewMode = mode;
    this.#notify("view");
  }

  togglePresentation(active) {
    if (this.#isPresentation === active) return;
    this.#isPresentation = active;
    this.#notify("view");
  }

  toggleShowRemovedPresentation(active) {
    if (this.#showRemovedPresentation === active) return;
    this.#showRemovedPresentation = active;
    this.#notify("view");
  }

  resetLayout() {
    this.#zoomLevel = 1.0;
    this.#rebuildModels("layout-reset");
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  enterSubpatch(boxId) {
    const actualId = boxId.replace("_removed", "");
    const [pA, pB] = this.#resolveSubpatch(actualId);
    if (pA || pB) this.#pushSubpatch(pA, pB);
  }

  popSubpatch() {
    const prev = this.#navStack.pop();
    if (!prev) return;
    this.#patchA = prev.patchA;
    this.#patchB = prev.patchB;
    this.#recalculate();
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  #resolveSubpatch(id) {
    for (const { box } of this.#annotated.patcher.boxes) {
      const diff = box._diff;
      if (!diff) {
        if (box.id === id) return [box.patcher, box.patcher];
      } else if (diff.type === "deleted") {
        if (diff.previous?.id === id) return [diff.previous.patcher, undefined];
      } else if (diff.type === "added") {
        if (box.id === id) return [undefined, box.patcher];
      } else {
        // modified or moved — box.id is the B-side id; diff.previous.id is the A-side id
        if (box.id === id || diff.previous?.id === id)
          return [diff.previous?.patcher, box.patcher];
      }
    }
    // Fallback for boxes not yet in the annotated result (e.g. before initial data load)
    const boxA = this.#patchA?.patcher.boxes.find((b) => b.box.id === id)?.box;
    const boxB = this.#patchB?.patcher.boxes.find((b) => b.box.id === id)?.box;
    return [boxA?.patcher, boxB?.patcher];
  }

  #pushSubpatch(pA, pB) {
    this.#navStack.push({ patchA: this.#patchA, patchB: this.#patchB });
    this.#patchA = pA ? { patcher: pA } : null;
    this.#patchB = pB ? { patcher: pB } : null;
    this.#recalculate("navigation");
  }

  #recalculate(eventType = "data") {
    this.#annotated = annotate(this.#patchA, this.#patchB);
    this.#rebuildModels(eventType);
  }

  #rebuildModels(eventType = "data") {
    this.#models = {
      diff: DiffPresenter.render(this.#annotated),
      before: DiffPresenter.render(this.#patchA),
      after: DiffPresenter.render(this.#patchB),
    };
    this.#metadataDiffs = DiffPresenter.compareMetadata(
      this.#patchA,
      this.#patchB,
    );
    this.#notify(eventType);
  }

  #notify(type, pivot) {
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { type, ...(pivot && { pivot }) },
      }),
    );
  }
}
