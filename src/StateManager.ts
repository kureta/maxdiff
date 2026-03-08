import { DiffPresenter } from "./DiffPresenter.js";

/**
 * Manages the application state and business logic.
 * Emits 'state-change' events when state updates.
 */
export class StateManager extends EventTarget {
  #state = {
    dataA: null,
    dataB: null,
    diffData: null,
    zoomLevel: 1.0,
    navStack: [],
    viewMode: "diff", // 'before', 'after', 'diff'
    isPresentation: false,
    metadata: {},
    metadataDiffs: [],
  };

  constructor() {
    super();
  }

  get state() {
    return this.#state;
  }

  /**
   * Returns the data formatted for the patcher component based on current view mode.
   */
  get currentRenderData() {
    const { viewMode, dataA, dataB, diffData } = this.#state;
    if (viewMode === "before") {
      return dataA
        ? DiffPresenter.process(dataA, dataA)
        : { boxes: [], lines: [] };
    }
    if (viewMode === "after") {
      return dataB
        ? DiffPresenter.process(dataB, dataB)
        : { boxes: [], lines: [] };
    }
    return diffData || { boxes: [], lines: [] };
  }

  get currentMetadata() {
    const { viewMode, dataA, dataB, metadataDiffs } = this.#state;
    if (viewMode === "diff") {
      return { diffs: metadataDiffs, meta: {} };
    }
    const data = viewMode === "before" ? dataA : dataB;
    return { diffs: [], meta: data ? DiffPresenter.getMetadata(data) : {} };
  }

  setFileA(data) {
    this.#state.dataA = data;
    this.#recalculate();
  }

  setFileB(data) {
    this.#state.dataB = data;
    this.#recalculate();
  }

  setInitialData(dataA, dataB) {
    this.#state.dataA = dataA;
    this.#state.dataB = dataB;
    this.#recalculate();
  }

  setZoom(level, pivot) {
    const newLevel = Math.max(0.2, Math.min(level, 3.0));
    if (newLevel === this.#state.zoomLevel) return;
    this.#state.zoomLevel = newLevel;
    this.#notify("zoom", { pivot });
  }

  setViewMode(mode) {
    if (this.#state.viewMode === mode) return;
    this.#state.viewMode = mode;
    this.#notify("view");
  }

  togglePresentation(active) {
    if (this.#state.isPresentation === active) return;
    this.#state.isPresentation = active;
    this.#notify("view");
  }

  resetLayout() {
    this.#state.zoomLevel = 1.0;
    this.#recalculate();
    this.#notify("layout-reset");
  }

  pushSubpatch(pA, pB) {
    // Save current state to stack
    this.#state.navStack.push({
      dataA: this.#state.dataA,
      dataB: this.#state.dataB,
      diffData: this.#state.diffData,
      metadataDiffs: this.#state.metadataDiffs,
    });

    // Set new data
    this.#state.dataA = pA ? { patcher: pA } : null;
    this.#state.dataB = pB ? { patcher: pB } : null;

    // Recalculate diffs for the subpatch
    this.#recalculate(true);
  }

  popSubpatch() {
    if (this.#state.navStack.length === 0) return;

    const prev = this.#state.navStack.pop();
    this.#state.dataA = prev.dataA;
    this.#state.dataB = prev.dataB;
    this.#state.diffData = prev.diffData;
    this.#state.metadataDiffs = prev.metadataDiffs;

    this.#notify("data");
  }

  #recalculate(isNavigation = false) {
    if (!this.#state.dataA && !this.#state.dataB) {
      this.#state.diffData = null;
      this.#state.metadataDiffs = [];
    } else {
      this.#state.diffData = DiffPresenter.process(
        this.#state.dataA,
        this.#state.dataB,
      );
      this.#state.metadataDiffs = DiffPresenter.compareMetadata(
        this.#state.dataA,
        this.#state.dataB,
      );
    }
    this.#notify(isNavigation ? "navigation" : "data");
  }

  #notify(type, extras = {}) {
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { type, state: this.#state, ...extras },
      }),
    );
  }
}
