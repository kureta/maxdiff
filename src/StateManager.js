import { DiffPresenter } from "./DiffPresenter.js";
import { MaxDiff } from "./DiffEngine.js";

// ─── Empty Patch Fallback ─────────────────────────────────────────────────────

const EMPTY = { patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] } };

function safe(patch) {
  return patch ?? EMPTY;
}

// ─── StateManager ─────────────────────────────────────────────────────────────

export class StateManager extends EventTarget {
  #patchA = null;
  #patchB = null;
  #annotated = { patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] } };

  #models = {
    diff: { boxes: [], lines: [] },
    before: { boxes: [], lines: [] },
    after: { boxes: [], lines: [] },
  };

  #metadataDiffs = [];
  #navStack = [];

  zoomLevel = 1.0;
  viewMode = "diff";
  isPresentation = false;
  showRemovedPresentation = false;

  // ── Accessors ───────────────────────────────────────────────────────────────

  get renderModel() {
    return this.#models[this.viewMode];
  }

  get metadata() {
    if (this.viewMode === "diff")
      return { diffs: this.#metadataDiffs, values: {} };
    const patch = this.viewMode === "before" ? this.#patchA : this.#patchB;
    return { diffs: [], values: DiffPresenter.metadata(patch ?? undefined) };
  }

  get hasParent() {
    return this.#navStack.length > 0;
  }

  // ── Data Setters ────────────────────────────────────────────────────────────

  setFileA(data) {
    this.#patchA = data;
    this.#recalculate();
  }

  setFileB(data) {
    this.#patchB = data;
    this.#recalculate();
  }

  setInitialData(patchA, patchB) {
    this.#patchA = patchA;
    this.#patchB = patchB;
    this.#recalculate();
  }

  // ── View Controls ───────────────────────────────────────────────────────────

  setZoom(level, pivot) {
    const clamped = Math.max(0.2, Math.min(level, 3.0));
    if (clamped === this.zoomLevel) return;
    this.zoomLevel = clamped;
    this.#notify("zoom", pivot ? { pivot } : {});
  }

  setViewMode(mode) {
    if (this.viewMode === mode) return;
    this.viewMode = mode;
    this.#notify("view");
  }

  togglePresentation(active) {
    if (this.isPresentation === active) return;
    this.isPresentation = active;
    this.#notify("view");
  }

  toggleShowRemovedPresentation(active) {
    if (this.showRemovedPresentation === active) return;
    this.showRemovedPresentation = active;
    this.#notify("view");
  }

  resetLayout() {
    this.zoomLevel = 1.0;
    this.#recalculate("layout-reset");
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

  #pushSubpatch(pA, pB) {
    this.#navStack.push({ patchA: this.#patchA, patchB: this.#patchB });
    this.#patchA = pA ? { patcher: pA } : null;
    this.#patchB = pB ? { patcher: pB } : null;
    this.#recalculate("navigation");
  }

  #recalculate(eventType = "data") {
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

  #notify(type, extras = {}) {
    this.dispatchEvent(
      new CustomEvent("state-change", { detail: { type, ...extras } }),
    );
  }
}
