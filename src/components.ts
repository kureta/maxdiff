const boxStyles = new CSSStyleSheet();
boxStyles.replaceSync(`:host {
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
  transition:
    border-color 0.2s,
    color 0.2s;
}
:host(:hover) {
  border-color: var(--border-hover, #999);
}
:host(.added) {
  border-color: var(--accent-added, #4caf50) !important;
  color: var(--accent-added, #4caf50) !important;
}
:host(.removed) {
  border-color: var(--accent-removed, #f44336) !important;
  color: var(--accent-removed, #f44336) !important;
  opacity: 0.6;
}
:host(.modified) {
  border-color: var(--accent-modified, #ff9800) !important;
  color: var(--accent-modified, #ff9800) !important;
}
:host(.moved) {
  border-color: var(--accent-moved, #2196f3) !important;
  color: var(--accent-moved, #2196f3) !important;
  border-style: dashed !important;
}
:host(.highlighted) {
  box-shadow: 0 0 10px 2px var(--accent-moved, #2196f3);
  z-index: 100;
}

.inlet-point,
.outlet-point {
  position: absolute;
  width: 5px;
  height: 7px;
  background-color: var(--io-color, #888);
  border-radius: 2px;
  transform: translateX(-50%);
  z-index: 15;
}
.inlet-point.added,
.outlet-point.added {
  background-color: var(--accent-added, #4caf50) !important;
}
.inlet-point.removed,
.outlet-point.removed {
  background-color: var(--accent-removed, #f44336) !important;
  opacity: 0.4;
  z-index: 14;
}
:host(.added) .inlet-point,
:host(.added) .outlet-point {
  background-color: var(--accent-added, #4caf50);
}
:host(.removed) .inlet-point,
:host(.removed) .outlet-point {
  background-color: var(--accent-removed, #f44336);
}

.inlet-point {
  top: -2px;
}
.outlet-point {
  bottom: -2px;
}

.info-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background-color: var(--accent-moved, #2196f3);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s;
}
.info-indicator:hover {
  transform: scale(1.2);
  filter: brightness(1.1);
}

.presentation-indicator {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background-color: var(--bg-box, #333);
  border: 1px solid var(--border-box, #666);
  color: var(--text-muted, #ccc);
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.presentation-indicator.added {
  border-color: var(--accent-added, #4caf50);
  color: var(--accent-added, #4caf50);
}
.presentation-indicator.removed {
  border-color: var(--accent-removed, #f44336);
  color: var(--accent-removed, #f44336);
}

.box-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.main-text {
  font-weight: normal;
  white-space: pre-wrap;
  text-align: center;
}
.sub-text {
  font-size: 8px;
  opacity: 0.6;
  margin-top: 2px;
  font-style: italic;
  white-space: pre-wrap;
}
.diff-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  width: 100%;
}
.diff-old-text {
  text-decoration: line-through;
  color: var(--accent-removed, #f44336);
  font-size: 8px;
  opacity: 0.8;
  white-space: pre-wrap;
}
.diff-new-text {
  color: var(--accent-added, #4caf50);
  font-weight: bold;
  white-space: pre-wrap;
}
`);

const messageStyle = new CSSStyleSheet();
messageStyle.replaceSync(`:host {
  background-color: var(--bg-message, #555);
  border-radius: 10px;
}
`);

const commentStyle = new CSSStyleSheet();
commentStyle.replaceSync(`:host {
  background-color: transparent;
  border: none;
}
`);

const buttonStyle = new CSSStyleSheet();
buttonStyle.replaceSync(`:host {
  padding: 0;
}
.bang-circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 1.5px solid var(--border-box, #666);
  box-sizing: border-box;
  pointer-events: none;
}
:host(.added) .bang-circle {
  border-color: var(--accent-added, #4caf50);
}
:host(.removed) .bang-circle {
  border-color: var(--accent-removed, #f44336);
}
:host(.modified) .bang-circle {
  border-color: var(--accent-modified, #ff9800);
}
`);

const ioStyle = new CSSStyleSheet();
ioStyle.replaceSync(`:host {
  padding: 0;
  min-width: 20px;
  min-height: 20px;
}
.io-number {
  border: none;
  background-color: transparent;
  font-weight: bold;
  font-size: 8px;
  color: var(--text-muted, #ccc);
  line-height: 1;
  margin: 1px 0;
}
.io-triangle {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--io-color, #888);
  margin: 2px 0;
}
`);

const panelStyle = new CSSStyleSheet();
panelStyle.replaceSync(`:host {
  z-index: 5;
}
`);

const patcherStyle = new CSSStyleSheet();
patcherStyle.replaceSync(`:host {
  display: block;
  position: relative;
  transform-origin: top left;
  width: 100%;
  height: 100%;
  border: 1px dashed var(--border-color, #444);
  box-sizing: border-box;
}
#svg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 7;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.patchline {
  stroke: var(--io-color, #888);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
}
.patchline.added {
  stroke: var(--accent-added, #4caf50);
}
.patchline.removed {
  stroke: var(--accent-removed, #f44336);
  stroke-dasharray: 5, 5;
}
.patchline.modified {
  stroke: var(--accent-modified, #ff9800);
}
.patchline.moved {
  stroke: var(--accent-moved, #2196f3);
  stroke-dasharray: 2, 2;
}
`);

export type Rect = [number, number, number, number];

export interface BoxViewModel {
  id: string;
  maxclass: string;
  text?: string;
  name?: string;
  numinlets?: number;
  numoutlets?: number;
  patching_rect?: Rect;
  presentation_rect?: Rect;
  presentation?: number;
  diffState?: string;
  oldText?: string;
  attrDiffs?: { key: string; old?: unknown; new?: unknown }[];
  patcher?: unknown;
  patcherA?: unknown;
  patcherB?: unknown;
  saved_attribute_attributes?: {
    valueof?: {
      parameter_longname?: string;
      parameter_shortname?: string;
      [key: string]: unknown;
    };
  };
  index?: number;
}

export interface LineViewModel {
  source: [string, number];
  destination: [string, number];
  diffState?: string;
}

function getBoxRect(box: BoxViewModel, isPresentation: boolean): Rect | null {
  if (isPresentation) {
    const rect =
      box.presentation_rect ??
      (box.attrDiffs?.find((d) => d.key === "presentation_rect")?.old as Rect);
    if (rect) return rect;
  }
  return box.patching_rect ?? null;
}

function createSVGPath(attributes: Record<string, string>): SVGPathElement {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  for (const [key, value] of Object.entries(attributes))
    path.setAttribute(key, value);
  return path;
}

export class MaxBox extends HTMLElement {
  #data: BoxViewModel | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [boxStyles];
  }

  static get observedAttributes(): string[] {
    return ["presentation"];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name === "presentation" && oldValue !== newValue) {
      this.updatePosition();
    }
  }

  set data(value: BoxViewModel | null) {
    this.#data = value;
    this.updatePosition();
    this.render();
  }

  get data(): BoxViewModel | null {
    return this.#data;
  }

  updatePosition(): void {
    if (!this.#data) return;

    const rect = getBoxRect(this.#data, this.hasAttribute("presentation"));
    if (!rect) return;

    const [x, y, w, h] = rect;
    Object.assign(this.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
  }

  getDisplayName(): { main: string; sub: string | null } {
    const box = this.#data!;
    const attrs = box.saved_attribute_attributes?.valueof ?? {};
    const pretty = attrs.parameter_longname ?? attrs.parameter_shortname;
    const basic = box.text ?? box.maxclass;

    const main =
      box.maxclass === "bpatcher" && box.name
        ? `${pretty ?? basic} ${box.name}`
        : (pretty ?? basic);
    const sub = pretty && pretty !== basic ? basic : null;

    return { main: main as string, sub: sub as string | null };
  }

  getInletsOutlets(): string {
    const {
      numinlets = 1,
      numoutlets = 1,
      attrDiffs = [],
      diffState,
    } = this.#data!;

    const createPoints = (
      num: number,
      className: string,
      stateClass: string = "",
    ) =>
      Array.from({ length: num }, (_, i) => {
        const left = `${(100 / (num + 1)) * (i + 1)}%`;
        return `
<div class="${className} ${stateClass}" style="left: ${left}"></div>
`;
      }).join("");

    let inletsHtml = "";
    const inletDiff =
      diffState === "modified"
        ? attrDiffs.find((d) => d.key === "numinlets")
        : null;

    if (inletDiff) {
      inletsHtml =
        createPoints((inletDiff.old as number) ?? 1, "inlet-point", "removed") +
        createPoints((inletDiff.new as number) ?? 1, "inlet-point", "added");
    } else {
      inletsHtml = createPoints(numinlets, "inlet-point");
    }

    let outletsHtml = "";
    const outletDiff =
      diffState === "modified"
        ? attrDiffs.find((d) => d.key === "numoutlets")
        : null;

    if (outletDiff) {
      outletsHtml =
        createPoints(
          (outletDiff.old as number) ?? 1,
          "outlet-point",
          "removed",
        ) +
        createPoints((outletDiff.new as number) ?? 1, "outlet-point", "added");
    } else {
      outletsHtml = createPoints(numoutlets, "outlet-point");
    }

    return inletsHtml + outletsHtml;
  }

  getContent(): string {
    const { main, sub } = this.getDisplayName();
    const { diffState, oldText, text, maxclass } = this.#data!;
    const isModified = diffState === "modified";

    let contentHtml =
      isModified && oldText && oldText !== (text ?? maxclass) && !sub
        ? `
<div class="diff-text-container">
  <div class="diff-old-text">${oldText}</div>
  <div class="diff-new-text">${main}</div>
</div>
`
        : `<span class="main-text">${main}</span>`;

    if (sub) {
      contentHtml += `<span class="sub-text">(${sub})</span>`;
    }

    return `
<div class="box-content">${contentHtml}</div>
`;
  }

  render(): void {
    if (!this.#data) return;
    const {
      maxclass = "",
      diffState = "",
      patcher,
      patcherA,
      patcherB,
      attrDiffs,
    } = this.#data;
    const hasSubpatch = diffState !== "" ? patcherA || patcherB : patcher;

    this.className = `max-box ${maxclass} ${diffState}`;

    if (hasSubpatch) {
      this.style.borderStyle = "double";
      this.style.borderWidth = "3px";
    }

    const indicator =
      diffState === "modified" && (attrDiffs?.length ?? 0) > 0
        ? `
<div class="info-indicator">i</div>
`
        : "";

    let presentationIndicator = "";
    const presentationDiff = attrDiffs?.find((d) => d.key === "presentation");

    if (presentationDiff) {
      if (presentationDiff.new === 1) {
        presentationIndicator = `
<div class="presentation-indicator added" title="Added to presentation">🐵</div>
`;
      } else if (presentationDiff.old === 1) {
        presentationIndicator = `
<div class="presentation-indicator removed" title="Removed from presentation">
  🙈
</div>
`;
      }
    }

    this.shadowRoot!.innerHTML = `${this.getContent()}${this.getInletsOutlets()}${indicator}${presentationIndicator}`;
  }
}

export class MaxMessage extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      messageStyle,
    ];
  }
}

export class MaxComment extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      commentStyle,
    ];
  }
}

export class MaxButton extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      buttonStyle,
    ];
  }
  getContent(): string {
    return `
<div class="bang-circle"></div>
`;
  }
}

export class MaxToggle extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      buttonStyle,
    ];
  }
  getContent(): string {
    return `
<div class="box-content">X</div>
`;
  }
}

export class MaxIO extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      ioStyle,
    ];
  }
  getContent(): string {
    const b = this.data!;
    const num = `
<div class="io-number">${b.index ?? 1}</div>
`;
    const tri = `
<div class="io-triangle"></div>
`;
    return `
<div class="box-content">${b.maxclass === "inlet" ? num + tri : tri + num}</div>
`;
  }
}

export class MaxInlet extends MaxIO {}
export class MaxOutlet extends MaxIO {}

export class MaxPanel extends MaxBox {
  constructor() {
    super();
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      panelStyle,
    ];
  }
}

export class MaxPatcher extends HTMLElement {
  #boxes: BoxViewModel[] = [];
  #lines: LineViewModel[] = [];
  #isDiff = false;
  #isPresentation = false;
  public showRemovedPresentation = false;
  #boxMap = new Map<string, BoxViewModel>();

  private container: HTMLDivElement;
  private svgLayer: SVGSVGElement;

  static get observedAttributes() {
    return ["presentation", "diff"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [patcherStyle];
    this.shadowRoot!.innerHTML = `<div id="container"></div>
<svg id="svg-layer"></svg>`;
    this.container = this.shadowRoot!.getElementById(
      "container",
    ) as HTMLDivElement;
    this.svgLayer = this.shadowRoot!.getElementById(
      "svg-layer",
    ) as unknown as SVGSVGElement;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (name === "presentation") this.#isPresentation = newValue !== null;
    if (name === "diff") this.#isDiff = newValue !== null;
    this.render();
  }

  set patchData({
    boxes,
    lines,
  }: {
    boxes: BoxViewModel[];
    lines: LineViewModel[];
  }) {
    this.#boxes = boxes;
    this.#lines = lines;
    this.render();
  }

  render(): void {
    this.container.innerHTML = "";
    this.#boxMap.clear();

    let maxX = 0,
      maxY = 0;

    const visibleBoxes = this.#boxes.filter((b) => {
      if (
        !this.#isPresentation ||
        b.presentation ||
        (b.diffState === "removed" && b.presentation_rect)
      )
        return true;
      if (
        this.showRemovedPresentation &&
        b.attrDiffs?.find((d) => d.key === "presentation")?.old === 1
      )
        return true;
      return false;
    });

    for (const box of visibleBoxes) {
      this.#boxMap.set(box.id, box);
      const rect = getBoxRect(box, this.#isPresentation);
      if (!rect) continue;

      maxX = Math.max(maxX, rect[0] + rect[2]);
      maxY = Math.max(maxY, rect[1] + rect[3]);
      this.container.appendChild(this.createBoxElement(box));
    }

    this.style.width = `${maxX + 200}px`;
    this.style.height = `${maxY + 200}px`;
    this.updateLines();
  }

  updateLines(): void {
    this.svgLayer.innerHTML = "";
    for (const line of this.#lines) {
      const src = this.#boxMap.get(line.source[0]);
      const dst = this.#boxMap.get(line.destination[0]);
      if (!src || !dst) {
        console.error(
          `[MaxPatcher] Unresolved line endpoint:`,
          !src
            ? `source "${line.source[0]}"`
            : `destination "${line.destination[0]}"`,
          line,
        );
        continue;
      }
      if (src && dst)
        this.svgLayer.appendChild(this.createConnectionPath(src, dst, line));
    }
  }

  createConnectionPath(
    src: BoxViewModel,
    dst: BoxViewModel,
    line: LineViewModel,
  ): SVGPathElement {
    const sR = getBoxRect(src, this.#isPresentation);
    const dR = getBoxRect(dst, this.#isPresentation);
    if (!sR || !dR) return createSVGPath({});

    const sX =
      sR[0] + (sR[2] / ((src.numoutlets ?? 1) + 1)) * (line.source[1] + 1);
    const sY = sR[1] + sR[3];
    const dX =
      dR[0] + (dR[2] / ((dst.numinlets ?? 1) + 1)) * (line.destination[1] + 1);
    const dY = dR[1];
    const off = Math.max(20, Math.abs(dY - sY) * 0.4);

    return createSVGPath({
      class: `patchline ${this.#isDiff && line.diffState ? line.diffState : ""}`,
      d: `M ${sX} ${sY} C ${sX} ${sY + off}, ${dX} ${dY - off}, ${dX} ${dY}`,
      "data-src": line.source[0],
      "data-dst": line.destination[0],
    });
  }

  createBoxElement(box: BoxViewModel): HTMLElement {
    const tag =
      (
        {
          message: "max-message",
          comment: "max-comment",
          button: "max-button",
          toggle: "max-toggle",
          inlet: "max-inlet",
          outlet: "max-outlet",
          panel: "max-panel",
          "bach.roll": "max-panel",
          "bach.score": "max-panel",
        } as Record<string, string>
      )[box.maxclass] ?? "max-box";

    const el = document.createElement(tag) as MaxBox;
    el.id = `box-${box.id}`;
    if (this.#isPresentation) el.setAttribute("presentation", "");
    el.data = box;

    el.addEventListener("click", (e: MouseEvent) => {
      if (el.dataset.dragged) return;
      this.dispatchEvent(
        new CustomEvent("box-click", {
          detail: { box, originalEvent: e },
          bubbles: true,
          composed: true,
        }),
      );
    });

    el.addEventListener("dblclick", (e: MouseEvent) => {
      this.dispatchEvent(
        new CustomEvent("box-dblclick", {
          detail: { box, originalEvent: e },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.makeDraggable(el, box);

    return el;
  }

  makeDraggable(el: HTMLElement, box: BoxViewModel): void {
    let startX: number;
    let startY: number;
    let initialPos: { x: number; y: number };
    let rafId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - startX) / (this.zoomLevel ?? 1);
      const dy = (e.clientY - startY) / (this.zoomLevel ?? 1);

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (dx === 0 && dy === 0) {
          rafId = null;
          return;
        }

        el.dataset.dragged = "true";
        const nx = initialPos.x + dx;
        const ny = initialPos.y + dy;

        const rectProp =
          this.#isPresentation && box.presentation_rect
            ? "presentation_rect"
            : "patching_rect";

        if (!box[rectProp]) box[rectProp] = [0, 0, 0, 0];

        box[rectProp]![0] = nx;
        box[rectProp]![1] = ny;

        el.style.left = `${nx}px`;
        el.style.top = `${ny}px`;

        const right = nx + parseFloat(el.style.width || "0");
        const bottom = ny + parseFloat(el.style.height || "0");
        const currentW = parseFloat(this.style.width || "0");
        const currentH = parseFloat(this.style.height || "0");

        if (right > currentW) this.style.width = `${right + 20}px`;
        if (bottom > currentH) this.style.height = `${bottom + 20}px`;

        this.updateLines();
        rafId = null;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setTimeout(() => delete el.dataset.dragged, 0);
    };

    el.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      initialPos = {
        x: parseFloat(el.style.left || "0"),
        y: parseFloat(el.style.top || "0"),
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      e.stopPropagation();
    });
  }

  highlightBox(boxId: string): void {
    const el = this.shadowRoot!.getElementById(`box-${boxId}`);
    if (el) {
      el.classList.add("highlighted");
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  clearHighlight(): void {
    this.shadowRoot!.querySelectorAll(".highlighted").forEach((el) =>
      el.classList.remove("highlighted"),
    );
  }

  get zoomLevel(): number {
    const matrix = new DOMMatrix(getComputedStyle(this).transform);
    return matrix.a || 1;
  }
}

const elements: Record<string, CustomElementConstructor> = {
  "max-box": MaxBox,
  "max-message": MaxMessage,
  "max-comment": MaxComment,
  "max-button": MaxButton,
  "max-toggle": MaxToggle,
  "max-inlet": MaxInlet,
  "max-outlet": MaxOutlet,
  "max-panel": MaxPanel,
  "max-patcher": MaxPatcher,
};

for (const [name, constructor] of Object.entries(elements)) {
  if (!customElements.get(name)) customElements.define(name, constructor);
}
