// ─── View Model Types ─────────────────────────────────────────────────────────

export type Rect = [number, number, number, number];

export type DiffState = "unchanged" | "added" | "removed" | "modified" | "moved";

export interface AttrDiff {
  readonly key: string;
  readonly old?: unknown;
  readonly new?: unknown;
}

export interface BoxViewModel {
  readonly id: string;
  readonly maxclass: string;
  readonly text?: string;
  readonly name?: string;
  readonly numinlets?: number;
  readonly numoutlets?: number;
  readonly patching_rect?: Rect;
  readonly presentation_rect?: Rect;
  readonly presentation?: number;
  readonly diffState?: DiffState;
  readonly oldText?: string;
  readonly attrDiffs?: readonly AttrDiff[];
  readonly patcher?: unknown;
  readonly patcherA?: unknown;
  readonly patcherB?: unknown;
  readonly saved_attribute_attributes?: {
    readonly valueof?: {
      readonly parameter_longname?: string;
      readonly parameter_shortname?: string;
      readonly [key: string]: unknown;
    };
  };
  readonly index?: number;
}

export interface LineViewModel {
  readonly source: [string, number];
  readonly destination: [string, number];
  readonly diffState?: DiffState;
}

export interface PatchData {
  readonly boxes: readonly BoxViewModel[];
  readonly lines: readonly LineViewModel[];
}

// ─── Style Sheets ─────────────────────────────────────────────────────────────

function sheet(css: string): CSSStyleSheet {
  const s = new CSSStyleSheet();
  s.replaceSync(css);
  return s;
}

const BASE_BOX_STYLE = sheet(`
:host {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  overflow: visible;
  background-color: var(--bg-box, #333);
  border: 1px solid var(--border-box, #666);
  color: var(--text-muted, #ccc);
  font-size: 10px;
  font-family: "Lato", "Arial", sans-serif;
  white-space: pre-wrap;
  padding: 0 4px;
  user-select: none;
  -webkit-user-select: none;
  transition: border-color 0.2s, color 0.2s;
}
:host(:hover)   { border-color: var(--border-hover, #999); }
:host(.added)   { border-color: var(--accent-added,    #4caf50) !important; color: var(--accent-added,    #4caf50) !important; }
:host(.removed) { border-color: var(--accent-removed,  #f44336) !important; color: var(--accent-removed,  #f44336) !important; opacity: 0.6; }
:host(.modified){ border-color: var(--accent-modified, #ff9800) !important; color: var(--accent-modified, #ff9800) !important; }
:host(.moved)   { border-color: var(--accent-moved,    #2196f3) !important; color: var(--accent-moved,    #2196f3) !important; border-style: dashed !important; }
:host(.highlighted) { box-shadow: 0 0 10px 2px var(--accent-moved, #2196f3); z-index: 100; }

.inlet-point, .outlet-point {
  position: absolute; width: 5px; height: 7px;
  background-color: var(--io-color, #888); border-radius: 2px;
  transform: translateX(-50%); z-index: 15;
}
.inlet-point  { top: -2px; }
.outlet-point { bottom: -2px; }
.inlet-point.added,  .outlet-point.added  { background-color: var(--accent-added,   #4caf50) !important; }
.inlet-point.removed,.outlet-point.removed{ background-color: var(--accent-removed, #f44336) !important; opacity: 0.4; z-index: 14; }
:host(.added)   .inlet-point, :host(.added)   .outlet-point { background-color: var(--accent-added,   #4caf50); }
:host(.removed) .inlet-point, :host(.removed) .outlet-point { background-color: var(--accent-removed, #f44336); }

.info-indicator {
  position: absolute; top: -8px; right: -8px;
  width: 16px; height: 16px;
  background-color: var(--accent-moved, #2196f3);
  color: white; border-radius: 50%; font-size: 10px;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; z-index: 20;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: transform 0.1s;
}
.info-indicator:hover { transform: scale(1.2); filter: brightness(1.1); }

.presentation-indicator {
  position: absolute; bottom: -8px; right: -8px;
  width: 16px; height: 16px;
  background-color: var(--bg-box, #333);
  border: 1px solid var(--border-box, #666);
  color: var(--text-muted, #ccc); border-radius: 50%;
  font-size: 10px; display: flex; align-items: center; justify-content: center;
  z-index: 20; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.presentation-indicator.added   { border-color: var(--accent-added,   #4caf50); color: var(--accent-added,   #4caf50); }
.presentation-indicator.removed { border-color: var(--accent-removed, #f44336); color: var(--accent-removed, #f44336); }

.box-content { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; pointer-events: none; }
.main-text   { font-weight: normal; white-space: pre-wrap; text-align: center; }
.sub-text    { font-size: 8px; opacity: 0.6; margin-top: 2px; font-style: italic; white-space: pre-wrap; }
.diff-text-container { display: flex; flex-direction: column; align-items: center; line-height: 1.2; width: 100%; }
.diff-old-text { text-decoration: line-through; color: var(--accent-removed, #f44336); font-size: 8px; opacity: 0.8; white-space: pre-wrap; }
.diff-new-text { color: var(--accent-added, #4caf50); font-weight: bold; white-space: pre-wrap; }
`);

const MESSAGE_STYLE    = sheet(`:host { background-color: var(--bg-message, #555); border-radius: 10px; }`);
const COMMENT_STYLE    = sheet(`:host { background-color: transparent; border: none; }`);
const BUTTON_STYLE     = sheet(`
  :host { padding: 0; }
  .bang-circle { width: 80%; height: 80%; border-radius: 50%; border: 1.5px solid var(--border-box, #666); box-sizing: border-box; pointer-events: none; }
  :host(.added)    .bang-circle { border-color: var(--accent-added,    #4caf50); }
  :host(.removed)  .bang-circle { border-color: var(--accent-removed,  #f44336); }
  :host(.modified) .bang-circle { border-color: var(--accent-modified, #ff9800); }
`);
const IO_STYLE         = sheet(`
  :host { padding: 0; min-width: 20px; min-height: 20px; }
  .io-number   { border: none; background-color: transparent; font-weight: bold; font-size: 8px; color: var(--text-muted, #ccc); line-height: 1; margin: 1px 0; }
  .io-triangle { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--io-color, #888); margin: 2px 0; }
`);
const PANEL_STYLE      = sheet(`:host { z-index: 5; }`);
const PATCHER_STYLE    = sheet(`
  :host { display: block; position: relative; transform-origin: top left; width: 100%; height: 100%; border: 1px dashed var(--border-color, #444); box-sizing: border-box; }
  #svg-layer { position: absolute; inset: 0; pointer-events: none; z-index: 7; width: 100%; height: 100%; overflow: visible; }
  .patchline          { stroke: var(--io-color,        #888); stroke-width: 2; fill: none; stroke-linecap: round; }
  .patchline.added    { stroke: var(--accent-added,    #4caf50); }
  .patchline.removed  { stroke: var(--accent-removed,  #f44336); stroke-dasharray: 5, 5; }
  .patchline.modified { stroke: var(--accent-modified, #ff9800); }
  .patchline.moved    { stroke: var(--accent-moved,    #2196f3); stroke-dasharray: 2, 2; }
`);

// ─── Box Rendering Helpers ────────────────────────────────────────────────────

function getRect(box: BoxViewModel, presentation: boolean): Rect | null {
  if (presentation) {
    const rect = box.presentation_rect
      ?? (box.attrDiffs?.find((d) => d.key === "presentation_rect")?.old as Rect | undefined);
    if (rect) return rect;
  }
  return box.patching_rect ?? null;
}

function ioPoints(count: number, className: string, stateClass = ""): string {
  return Array.from({ length: count }, (_, i) => {
    const left = `${(100 / (count + 1)) * (i + 1)}%`;
    return `<div class="${className} ${stateClass}" style="left:${left}"></div>`;
  }).join("");
}

function renderIoPorts(box: BoxViewModel): string {
  const inletDiff  = box.diffState === "modified" ? box.attrDiffs?.find((d) => d.key === "numinlets")  : undefined;
  const outletDiff = box.diffState === "modified" ? box.attrDiffs?.find((d) => d.key === "numoutlets") : undefined;

  const inlets  = inletDiff
    ? ioPoints(inletDiff.old  as number ?? 1, "inlet-point",  "removed") + ioPoints(inletDiff.new  as number ?? 1, "inlet-point",  "added")
    : ioPoints(box.numinlets  ?? 1, "inlet-point");

  const outlets = outletDiff
    ? ioPoints(outletDiff.old as number ?? 1, "outlet-point", "removed") + ioPoints(outletDiff.new as number ?? 1, "outlet-point", "added")
    : ioPoints(box.numoutlets ?? 1, "outlet-point");

  return inlets + outlets;
}

function resolveDisplayName(box: BoxViewModel): { main: string; sub: string | null } {
  const valueof = box.saved_attribute_attributes?.valueof ?? {};
  const pretty  = valueof.parameter_longname ?? valueof.parameter_shortname;
  const basic   = box.text ?? box.maxclass;
  const main    = box.maxclass === "bpatcher" && box.name ? `${pretty ?? basic} ${box.name}` : (pretty ?? basic);
  return { main: main as string, sub: pretty && pretty !== basic ? (basic as string) : null };
}

function renderBoxContent(box: BoxViewModel): string {
  const { main, sub } = resolveDisplayName(box);
  const isTextModified = box.diffState === "modified" && box.oldText && box.oldText !== (box.text ?? box.maxclass) && !sub;

  const bodyHtml = isTextModified
    ? `<div class="diff-text-container"><div class="diff-old-text">${box.oldText}</div><div class="diff-new-text">${main}</div></div>`
    : `<span class="main-text">${main}</span>`;

  return `<div class="box-content">${bodyHtml}${sub ? `<span class="sub-text">(${sub})</span>` : ""}</div>`;
}

function renderInfoIndicator(box: BoxViewModel): string {
  return box.diffState === "modified" && (box.attrDiffs?.length ?? 0) > 0
    ? `<div class="info-indicator">i</div>` : "";
}

function renderPresentationIndicator(box: BoxViewModel): string {
  const diff = box.attrDiffs?.find((d) => d.key === "presentation");
  if (!diff) return "";
  return diff.new === 1
    ? `<div class="presentation-indicator added" title="Added to presentation">🐵</div>`
    : `<div class="presentation-indicator removed" title="Removed from presentation">🙈</div>`;
}

// ─── SVG Path ─────────────────────────────────────────────────────────────────

function svgPath(attrs: Record<string, string>): SVGPathElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// ─── Base Box Component ───────────────────────────────────────────────────────

export class MaxBox extends HTMLElement {
  #box: BoxViewModel | null = null;

  constructor(extraSheets: CSSStyleSheet[] = []) {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [BASE_BOX_STYLE, ...extraSheets];
  }

  static get observedAttributes(): string[] { return ["presentation"]; }

  attributeChangedCallback(_name: string, old: string | null, next: string | null): void {
    if (old !== next) this.#updatePosition();
  }

  set data(value: BoxViewModel | null) {
    this.#box = value;
    this.#updatePosition();
    this.#render();
  }

  get data(): BoxViewModel | null { return this.#box; }

  /** Subclasses override to supply custom inner HTML. */
  protected innerHtml(): string {
    return renderBoxContent(this.#box!) + renderIoPorts(this.#box!) + renderInfoIndicator(this.#box!) + renderPresentationIndicator(this.#box!);
  }

  #updatePosition(): void {
    const rect = this.#box && getRect(this.#box, this.hasAttribute("presentation"));
    if (!rect) return;
    const [x, y, w, h] = rect;
    Object.assign(this.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  }

  #render(): void {
    if (!this.#box) return;
    const { maxclass = "", diffState = "", patcher, patcherA, patcherB } = this.#box;
    const hasSubpatch = diffState ? (patcherA ?? patcherB) : patcher;

    this.className = `max-box ${maxclass} ${diffState}`;
    if (hasSubpatch) { this.style.borderStyle = "double"; this.style.borderWidth = "3px"; }

    this.shadowRoot!.innerHTML = this.innerHtml();
  }
}

// ─── Specialised Box Subclasses ───────────────────────────────────────────────

export class MaxMessage extends MaxBox {
  constructor() { super([MESSAGE_STYLE]); }
}

export class MaxComment extends MaxBox {
  constructor() { super([COMMENT_STYLE]); }
}

export class MaxButton extends MaxBox {
  constructor() { super([BUTTON_STYLE]); }
  protected override innerHtml(): string { return `<div class="bang-circle"></div>`; }
}

export class MaxToggle extends MaxBox {
  constructor() { super([BUTTON_STYLE]); }
  protected override innerHtml(): string { return `<div class="box-content">X</div>`; }
}

export class MaxIO extends MaxBox {
  constructor() { super([IO_STYLE]); }
  protected override innerHtml(): string {
    const b = this.data!;
    const num = `<div class="io-number">${b.index ?? 1}</div>`;
    const tri = `<div class="io-triangle"></div>`;
    return `<div class="box-content">${b.maxclass === "inlet" ? num + tri : tri + num}</div>`;
  }
}

export class MaxInlet  extends MaxIO {}
export class MaxOutlet extends MaxIO {}

export class MaxPanel extends MaxBox {
  constructor() { super([PANEL_STYLE]); }
}

// ─── Box Tag Map ──────────────────────────────────────────────────────────────

const BOX_TAG: Readonly<Record<string, string>> = {
  message:      "max-message",
  comment:      "max-comment",
  button:       "max-button",
  toggle:       "max-toggle",
  inlet:        "max-inlet",
  outlet:       "max-outlet",
  panel:        "max-panel",
  "bach.roll":  "max-panel",
  "bach.score": "max-panel",
};

// ─── Patcher Component ────────────────────────────────────────────────────────

export class MaxPatcher extends HTMLElement {
  #boxes: readonly BoxViewModel[] = [];
  #lines: readonly LineViewModel[] = [];
  #isDiff = false;
  #isPresentation = false;
  #boxMap = new Map<string, BoxViewModel>();

  showRemovedPresentation = false;

  private readonly container: HTMLDivElement;
  private readonly svgLayer: SVGSVGElement;

  static get observedAttributes(): string[] { return ["presentation", "diff"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [PATCHER_STYLE];
    this.shadowRoot!.innerHTML = `<div id="container"></div><svg id="svg-layer"></svg>`;
    this.container = this.shadowRoot!.getElementById("container") as HTMLDivElement;
    this.svgLayer  = this.shadowRoot!.getElementById("svg-layer") as unknown as SVGSVGElement;
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === "presentation") this.#isPresentation = next !== null;
    if (name === "diff")         this.#isDiff         = next !== null;
    this.#render();
  }

  set patchData({ boxes, lines }: PatchData) {
    this.#boxes = boxes;
    this.#lines = lines;
    this.#render();
  }

  highlightBox(id: string): void {
    this.shadowRoot!.getElementById(`box-${id}`)?.classList.add("highlighted");
  }

  clearHighlight(): void {
    this.shadowRoot!.querySelectorAll(".highlighted").forEach((el) => el.classList.remove("highlighted"));
  }

  get zoomLevel(): number {
    return new DOMMatrix(getComputedStyle(this).transform).a || 1;
  }

  // ── Rendering ──────────────────────────────────────────────────────────────

  #render(): void {
    this.container.innerHTML = "";
    this.#boxMap.clear();

    let maxX = 0, maxY = 0;

    for (const box of this.#visibleBoxes()) {
      this.#boxMap.set(box.id, box);
      const rect = getRect(box, this.#isPresentation);
      if (!rect) continue;
      maxX = Math.max(maxX, rect[0] + rect[2]);
      maxY = Math.max(maxY, rect[1] + rect[3]);
      this.container.appendChild(this.#createBoxEl(box));
    }

    this.style.width  = `${maxX + 200}px`;
    this.style.height = `${maxY + 200}px`;
    this.#renderLines();
  }

  #visibleBoxes(): readonly BoxViewModel[] {
    return this.#boxes.filter((b) => {
      if (!this.#isPresentation) return true;
      if (b.presentation || (b.diffState === "removed" && b.presentation_rect)) return true;
      return this.showRemovedPresentation && b.attrDiffs?.some((d) => d.key === "presentation" && d.old === 1);
    });
  }

  #renderLines(): void {
    this.svgLayer.innerHTML = "";
    for (const line of this.#lines) {
      const src = this.#boxMap.get(line.source[0]);
      const dst = this.#boxMap.get(line.destination[0]);
      if (!src || !dst) {
        console.error(`[MaxPatcher] Unresolved line: ${line.source[0]} → ${line.destination[0]}`);
        continue;
      }
      this.svgLayer.appendChild(this.#connectionPath(src, dst, line));
    }
  }

  #connectionPath(src: BoxViewModel, dst: BoxViewModel, line: LineViewModel): SVGPathElement {
    const sR = getRect(src, this.#isPresentation);
    const dR = getRect(dst, this.#isPresentation);
    if (!sR || !dR) return svgPath({});

    const sX = sR[0] + (sR[2] / ((src.numoutlets ?? 1) + 1)) * (line.source[1]      + 1);
    const sY = sR[1] + sR[3];
    const dX = dR[0] + (dR[2] / ((dst.numinlets  ?? 1) + 1)) * (line.destination[1] + 1);
    const dY = dR[1];
    const c  = Math.max(20, Math.abs(dY - sY) * 0.4);

    return svgPath({
      class:     `patchline ${this.#isDiff && line.diffState ? line.diffState : ""}`,
      d:         `M ${sX} ${sY} C ${sX} ${sY + c}, ${dX} ${dY - c}, ${dX} ${dY}`,
      "data-src": line.source[0],
      "data-dst": line.destination[0],
    });
  }

  // ── Box Element Factory ────────────────────────────────────────────────────

  #createBoxEl(box: BoxViewModel): HTMLElement {
    const tag = BOX_TAG[box.maxclass] ?? "max-box";
    const el  = document.createElement(tag) as MaxBox;
    el.id     = `box-${box.id}`;
    if (this.#isPresentation) el.setAttribute("presentation", "");
    el.data = box;

    el.addEventListener("click",    (e) => this.#onBoxClick(e, el, box));
    el.addEventListener("dblclick", (e) => this.#onBoxDblClick(e, box));
    this.#makeDraggable(el, box);
    return el;
  }

  #onBoxClick(e: MouseEvent, el: MaxBox, box: BoxViewModel): void {
    if (el.dataset["dragged"]) return;
    this.dispatchEvent(new CustomEvent("box-click", { detail: { box, originalEvent: e }, bubbles: true, composed: true }));
  }

  #onBoxDblClick(e: MouseEvent, box: BoxViewModel): void {
    this.dispatchEvent(new CustomEvent("box-dblclick", { detail: { box, originalEvent: e }, bubbles: true, composed: true }));
  }

  // ── Dragging ───────────────────────────────────────────────────────────────

  #makeDraggable(el: HTMLElement, box: BoxViewModel): void {
    let startX = 0, startY = 0;
    let initX  = 0, initY  = 0;
    let rafId: number | null = null;

    const onMove = (e: MouseEvent): void => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const zoom = this.zoomLevel;
        const nx = initX + (e.clientX - startX) / zoom;
        const ny = initY + (e.clientY - startY) / zoom;
        if (nx === initX && ny === initY) return;

        el.dataset["dragged"] = "true";
        // BoxViewModel is readonly for consumers; dragging is an intentional
        // local mutation of the live position only. Route through `unknown`.
        const mutableBox = box as unknown as Record<string, number[]>;
        const rectProp   = this.#isPresentation && mutableBox["presentation_rect"]
          ? "presentation_rect" : "patching_rect";

        if (!mutableBox[rectProp]) mutableBox[rectProp] = [0, 0, 0, 0];
        (mutableBox[rectProp] as number[])[0] = nx;
        (mutableBox[rectProp] as number[])[1] = ny;

        el.style.left = `${nx}px`;
        el.style.top  = `${ny}px`;

        const right  = nx + parseFloat(el.style.width  || "0");
        const bottom = ny + parseFloat(el.style.height || "0");
        if (right  > parseFloat(this.style.width  || "0")) this.style.width  = `${right  + 20}px`;
        if (bottom > parseFloat(this.style.height || "0")) this.style.height = `${bottom + 20}px`;

        this.#renderLines();
      });
    };

    const onUp = (): void => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      setTimeout(() => { delete el.dataset["dragged"]; }, 0);
    };

    el.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX; startY = e.clientY;
      initX  = parseFloat(el.style.left || "0");
      initY  = parseFloat(el.style.top  || "0");
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup",   onUp);
    });
  }
}

// ─── Custom Element Registration ──────────────────────────────────────────────

const ELEMENTS: Readonly<Record<string, CustomElementConstructor>> = {
  "max-box":     MaxBox,
  "max-message": MaxMessage,
  "max-comment": MaxComment,
  "max-button":  MaxButton,
  "max-toggle":  MaxToggle,
  "max-inlet":   MaxInlet,
  "max-outlet":  MaxOutlet,
  "max-panel":   MaxPanel,
  "max-patcher": MaxPatcher,
};

for (const [name, ctor] of Object.entries(ELEMENTS)) {
  if (!customElements.get(name)) customElements.define(name, ctor);
}
