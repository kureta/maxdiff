import { DiffPresenter } from "./DiffPresenter.js";
import { MaxPatchJSON } from "./DiffEngine.js";
import { BoxViewModel, LineViewModel } from "./components.js";

interface RenderModel {
  boxes: BoxViewModel[];
  lines: LineViewModel[];
}

export type ViewMode = "diff" | "before" | "after";

export class StateManager extends EventTarget {
  #dataA: MaxPatchJSON | null = null;
  #dataB: MaxPatchJSON | null = null;

  #models: Record<ViewMode, RenderModel> = {
    diff: { boxes: [], lines: [] },
    before: { boxes: [], lines: [] },
    after: { boxes: [], lines: [] },
  };

  #metadataDiffs: ReturnType<typeof DiffPresenter.compareMetadata> = [];
  #navStack: { dataA: MaxPatchJSON | null; dataB: MaxPatchJSON | null }[] = [];

  public zoomLevel = 1.0;
  public viewMode: ViewMode = "diff";
  public isPresentation = false;
  public showRemovedPresentation = false;

  get currentRenderData(): RenderModel {
    return this.#models[this.viewMode];
  }

  get currentMetadata() {
    if (this.viewMode === "diff")
      return { diffs: this.#metadataDiffs, meta: {} };
    const data = this.viewMode === "before" ? this.#dataA : this.#dataB;
    return { diffs: [], meta: DiffPresenter.getMetadata(data ?? undefined) };
  }

  get hasParent() {
    return this.#navStack.length > 0;
  }

  setFileA(data: MaxPatchJSON): void {
    this.#dataA = data;
    this.#recalculate();
  }

  setFileB(data: MaxPatchJSON): void {
    this.#dataB = data;
    this.#recalculate();
  }

  setInitialData(dataA: MaxPatchJSON, dataB: MaxPatchJSON): void {
    this.#dataA = dataA;
    this.#dataB = dataB;
    this.#recalculate();
  }

  setZoom(level: number, pivot?: { x: number; y: number }): void {
    const newLevel = Math.max(0.2, Math.min(level, 3.0));
    if (newLevel === this.zoomLevel) return;
    this.zoomLevel = newLevel;
    this.#notify("zoom", { pivot });
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
    this.#recalculate();
    this.#notify("layout-reset");
  }

  pushSubpatch(pA?: MaxPatchJSON, pB?: MaxPatchJSON): void {
    this.#navStack.push({ dataA: this.#dataA, dataB: this.#dataB });
    this.#dataA = pA ? ({ patcher: pA } as MaxPatchJSON) : null;
    this.#dataB = pB ? ({ patcher: pB } as MaxPatchJSON) : null;
    this.#recalculate("navigation");
  }

  popSubpatch(): void {
    const prev = this.#navStack.pop();
    if (!prev) return;
    this.#dataA = prev.dataA;
    this.#dataB = prev.dataB;
    this.#recalculate("data");
  }

  #recalculate(eventType: string = "data"): void {
    this.#models.diff = DiffPresenter.process(
      this.#dataA ?? undefined,
      this.#dataB ?? undefined,
    );
    this.#models.before = DiffPresenter.process(
      this.#dataA ?? undefined,
      this.#dataA ?? undefined,
    );
    this.#models.after = DiffPresenter.process(
      this.#dataB ?? undefined,
      this.#dataB ?? undefined,
    );
    this.#metadataDiffs = DiffPresenter.compareMetadata(
      this.#dataA ?? undefined,
      this.#dataB ?? undefined,
    );
    this.#notify(eventType);
  }

  #notify(type: string, extras: Record<string, unknown> = {}): void {
    this.dispatchEvent(
      new CustomEvent("state-change", { detail: { type, ...extras } }),
    );
  }
}
