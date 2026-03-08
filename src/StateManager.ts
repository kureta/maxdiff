// StateManager.ts
import { DiffPresenter } from "./DiffPresenter.js";

export class StateManager extends EventTarget {
  #state = {
    dataA: null as any,
    dataB: null as any,
    diffData: null as any,
    zoomLevel: 1.0,
    navStack: [] as any[],
    viewMode: "diff",
    isPresentation: false,
    showRemovedPresentation: false,
    metadata: {},
    metadataDiffs: [] as any[],
  };

  constructor() {
    super();
  }

  get state() {
    return this.#state;
  }

  get currentRenderData(): { boxes: any[]; lines: any[] } {
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

  get currentMetadata(): { diffs: any[]; meta: any } {
    const { viewMode, dataA, dataB, metadataDiffs } = this.#state;
    if (viewMode === "diff") {
      return { diffs: metadataDiffs, meta: {} };
    }
    const data = viewMode === "before" ? dataA : dataB;
    return { diffs: [], meta: data ? DiffPresenter.getMetadata(data) : {} };
  }

  setFileA(data: any): void {
    this.#state.dataA = data;
    this.#recalculate();
  }

  setFileB(data: any): void {
    this.#state.dataB = data;
    this.#recalculate();
  }

  setInitialData(dataA: any, dataB: any): void {
    this.#state.dataA = dataA;
    this.#state.dataB = dataB;
    this.#recalculate();
  }

  setZoom(level: number, pivot?: { x: number; y: number }): void {
    const newLevel = Math.max(0.2, Math.min(level, 3.0));
    if (newLevel === this.#state.zoomLevel) return;
    this.#state.zoomLevel = newLevel;
    this.#notify("zoom", { pivot });
  }

  setViewMode(mode: string): void {
    if (this.#state.viewMode === mode) return;
    this.#state.viewMode = mode;
    this.#notify("view");
  }

  togglePresentation(active: boolean): void {
    if (this.#state.isPresentation === active) return;
    this.#state.isPresentation = active;
    this.#notify("view");
  }

  toggleShowRemovedPresentation(active: boolean): void {
    if (this.#state.showRemovedPresentation === active) return;
    this.#state.showRemovedPresentation = active;
    this.#notify("view");
  }

  resetLayout(): void {
    this.#state.zoomLevel = 1.0;
    this.#recalculate();
    this.#notify("layout-reset");
  }

  pushSubpatch(pA: any, pB: any): void {
    this.#state.navStack.push({
      dataA: this.#state.dataA,
      dataB: this.#state.dataB,
      diffData: this.#state.diffData,
      metadataDiffs: this.#state.metadataDiffs,
    });

    this.#state.dataA = pA ? { patcher: pA } : null;
    this.#state.dataB = pB ? { patcher: pB } : null;

    this.#recalculate(true);
  }

  popSubpatch(): void {
    if (this.#state.navStack.length === 0) return;

    const prev = this.#state.navStack.pop();
    this.#state.dataA = prev.dataA;
    this.#state.dataB = prev.dataB;
    this.#state.diffData = prev.diffData;
    this.#state.metadataDiffs = prev.metadataDiffs;

    this.#notify("data");
  }

  #recalculate(isNavigation: boolean = false): void {
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

  #notify(type: string, extras: any = {}): void {
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { type, state: this.#state, ...extras },
      }),
    );
  }
}
