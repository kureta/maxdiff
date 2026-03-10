// ─── Style Sheets ─────────────────────────────────────────────────────────────

import BASE_BOX_STYLE from "./styles/base-box.css" with { type: "css" };
import MESSAGE_STYLE from "./styles/message.css" with { type: "css" };
import COMMENT_STYLE from "./styles/comment.css" with { type: "css" };
import BUTTON_STYLE from "./styles/button.css" with { type: "css" };
import IO_STYLE from "./styles/io.css" with { type: "css" };
import PANEL_STYLE from "./styles/panel.css" with { type: "css" };
import PATCHER_STYLE from "./styles/patcher.css" with { type: "css" };

// ─── Box Rendering Helpers ────────────────────────────────────────────────────

function getRect(box, presentation) {
  if (presentation) {
    const rect =
      box.presentation_rect ??
      box.attrDiffs?.find((d) => d.key === "presentation_rect")?.old;
    if (rect) return rect;
  }
  return box.patching_rect ?? null;
}

function ioPoints(count, className, stateClass = "") {
  return Array.from({ length: count }, (_, i) => {
    const left = `${(100 / (count + 1)) * (i + 1)}%`;
    return `<div class="${className} ${stateClass}" style="left:${left}"></div>`;
  }).join("");
}

function renderIoPorts(box) {
  const inletDiff =
    box.diffState === "modified"
      ? box.attrDiffs?.find((d) => d.key === "numinlets")
      : undefined;
  const outletDiff =
    box.diffState === "modified"
      ? box.attrDiffs?.find((d) => d.key === "numoutlets")
      : undefined;

  const inlets = inletDiff
    ? ioPoints(inletDiff.old ?? 1, "inlet-point", "removed") +
      ioPoints(inletDiff.new ?? 1, "inlet-point", "added")
    : ioPoints(box.numinlets ?? 1, "inlet-point");

  const outlets = outletDiff
    ? ioPoints(outletDiff.old ?? 1, "outlet-point", "removed") +
      ioPoints(outletDiff.new ?? 1, "outlet-point", "added")
    : ioPoints(box.numoutlets ?? 1, "outlet-point");

  return inlets + outlets;
}

function resolveDisplayName(box) {
  const valueof = box.saved_attribute_attributes?.valueof ?? {};
  const pretty = valueof.parameter_longname ?? valueof.parameter_shortname;
  const basic = box.text ?? box.maxclass;
  const main =
    box.maxclass === "bpatcher" && box.name
      ? `${pretty ?? basic} ${box.name}`
      : (pretty ?? basic);
  return { main, sub: pretty && pretty !== basic ? basic : null };
}

function renderBoxContent(box) {
  const { main, sub } = resolveDisplayName(box);
  const isTextModified =
    box.diffState === "modified" &&
    box.oldText &&
    box.oldText !== (box.text ?? box.maxclass) &&
    !sub;

  const bodyHtml = isTextModified
    ? `<div class="diff-text-container">
  <div class="diff-old-text">${box.oldText}</div>
  <div class="diff-new-text">${main}</div>
</div>`
    : `<span class="main-text">${main}</span>`;

  return `<div class="box-content">
  ${bodyHtml}${sub ? `<span class="sub-text">(${sub})</span>` : ""}
</div>`;
}

function renderInfoIndicator(box) {
  return box.diffState === "modified" && (box.attrDiffs?.length ?? 0) > 0
    ? `<div class="info-indicator">i</div>`
    : "";
}

function renderPresentationIndicator(box) {
  const diff = box.attrDiffs?.find((d) => d.key === "presentation");
  if (!diff) return "";
  return diff.new === 1
    ? `<div class="presentation-indicator added" title="Added to presentation">🐵</div>`
    : `<div class="presentation-indicator removed" title="Removed from presentation">
  🙈
</div>`;
}

// ─── SVG Path ─────────────────────────────────────────────────────────────────

function svgPath(attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// ─── Base Box Component ───────────────────────────────────────────────────────

export class MaxBox extends HTMLElement {
  #box = null;

  constructor(extraSheets = []) {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [BASE_BOX_STYLE, ...extraSheets];
  }

  static get observedAttributes() {
    return ["presentation"];
  }

  attributeChangedCallback(_name, old, next) {
    if (old !== next) this.#updatePosition();
  }

  set data(value) {
    this.#box = value;
    this.#updatePosition();
    this.#render();
  }

  get data() {
    return this.#box;
  }

  /** Subclasses override to supply custom inner HTML. */
  innerHtml() {
    return (
      renderBoxContent(this.#box) +
      renderIoPorts(this.#box) +
      renderInfoIndicator(this.#box) +
      renderPresentationIndicator(this.#box)
    );
  }

  #updatePosition() {
    const rect =
      this.#box && getRect(this.#box, this.hasAttribute("presentation"));
    if (!rect) return;
    const [x, y, w, h] = rect;
    Object.assign(this.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
  }

  #render() {
    if (!this.#box) return;
    const {
      maxclass = "",
      diffState = "",
      patcher,
      patcherA,
      patcherB,
    } = this.#box;
    const hasSubpatch = diffState ? (patcherA ?? patcherB) : patcher;

    this.className = `max-box ${maxclass} ${diffState}`;
    if (hasSubpatch) {
      this.style.borderStyle = "double";
      this.style.borderWidth = "3px";
    }

    this.shadowRoot.innerHTML = this.innerHtml();
  }
}

// ─── Specialised Box Subclasses ───────────────────────────────────────────────

export class MaxMessage extends MaxBox {
  constructor() {
    super([MESSAGE_STYLE]);
  }
}

export class MaxComment extends MaxBox {
  constructor() {
    super([COMMENT_STYLE]);
  }
}

export class MaxButton extends MaxBox {
  constructor() {
    super([BUTTON_STYLE]);
  }
  innerHtml() {
    return `<div class="bang-circle"></div>`;
  }
}

export class MaxToggle extends MaxBox {
  constructor() {
    super([BUTTON_STYLE]);
  }
  innerHtml() {
    return `<div class="box-content">X</div>`;
  }
}

export class MaxIO extends MaxBox {
  constructor() {
    super([IO_STYLE]);
  }
  innerHtml() {
    const b = this.data;
    const num = `<div class="io-number">${b.index ?? 1}</div>`;
    const tri = `<div class="io-triangle"></div>`;
    return `<div class="box-content">${b.maxclass === "inlet" ? num + tri : tri + num}</div>`;
  }
}

export class MaxInlet extends MaxIO {}
export class MaxOutlet extends MaxIO {}

export class MaxPanel extends MaxBox {
  constructor() {
    super([PANEL_STYLE]);
  }
}

// ─── Box Tag Map ──────────────────────────────────────────────────────────────

const BOX_TAG = {
  message: "max-message",
  comment: "max-comment",
  button: "max-button",
  toggle: "max-toggle",
  inlet: "max-inlet",
  outlet: "max-outlet",
  panel: "max-panel",
  "bach.roll": "max-panel",
  "bach.score": "max-panel",
};

// ─── Patcher Component ────────────────────────────────────────────────────────

export class MaxPatcher extends HTMLElement {
  #boxes = [];
  #lines = [];
  #isDiff = false;
  #isPresentation = false;
  #boxMap = new Map();

  showRemovedPresentation = false;

  static get observedAttributes() {
    return ["presentation", "diff"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [PATCHER_STYLE];
    this.shadowRoot.innerHTML = `<div id="container"></div>
<svg id="svg-layer"></svg>`;
    this.container = this.shadowRoot.getElementById("container");
    this.svgLayer = this.shadowRoot.getElementById("svg-layer");
  }

  attributeChangedCallback(name, old, next) {
    if (old === next) return;
    if (name === "presentation") this.#isPresentation = next !== null;
    if (name === "diff") this.#isDiff = next !== null;
    this.#render();
  }

  set patchData({ boxes, lines }) {
    this.#boxes = boxes;
    this.#lines = lines;
    this.#render();
  }

  highlightBox(id) {
    this.shadowRoot.getElementById(`box-${id}`)?.classList.add("highlighted");
  }

  clearHighlight() {
    this.shadowRoot
      .querySelectorAll(".highlighted")
      .forEach((el) => el.classList.remove("highlighted"));
  }

  get zoomLevel() {
    return new DOMMatrix(getComputedStyle(this).transform).a || 1;
  }

  // ── Rendering ──────────────────────────────────────────────────────────────

  #render() {
    this.container.innerHTML = "";
    this.#boxMap.clear();

    let maxX = 0,
      maxY = 0;

    for (const box of this.#visibleBoxes()) {
      this.#boxMap.set(box.id, box);
      const rect = getRect(box, this.#isPresentation);
      if (!rect) continue;
      maxX = Math.max(maxX, rect[0] + rect[2]);
      maxY = Math.max(maxY, rect[1] + rect[3]);
      this.container.appendChild(this.#createBoxEl(box));
    }

    this.style.width = `${maxX + 200}px`;
    this.style.height = `${maxY + 200}px`;
    this.#renderLines();
  }

  #visibleBoxes() {
    return this.#boxes.filter((b) => {
      if (!this.#isPresentation) return true;
      if (b.presentation || (b.diffState === "removed" && b.presentation_rect))
        return true;
      return (
        this.showRemovedPresentation &&
        b.attrDiffs?.some((d) => d.key === "presentation" && d.old === 1)
      );
    });
  }

  #renderLines() {
    this.svgLayer.innerHTML = "";
    for (const line of this.#lines) {
      const src = this.#boxMap.get(line.source[0]);
      const dst = this.#boxMap.get(line.destination[0]);
      if (!src || !dst) {
        console.error(
          `[MaxPatcher] Unresolved line: ${line.source[0]} → ${line.destination[0]}`,
        );
        continue;
      }
      this.svgLayer.appendChild(this.#connectionPath(src, dst, line));
    }
  }

  #connectionPath(src, dst, line) {
    const sR = getRect(src, this.#isPresentation);
    const dR = getRect(dst, this.#isPresentation);
    if (!sR || !dR) return svgPath({});

    const sX =
      sR[0] + (sR[2] / ((src.numoutlets ?? 1) + 1)) * (line.source[1] + 1);
    const sY = sR[1] + sR[3];
    const dX =
      dR[0] + (dR[2] / ((dst.numinlets ?? 1) + 1)) * (line.destination[1] + 1);
    const dY = dR[1];
    const c = Math.max(20, Math.abs(dY - sY) * 0.4);

    return svgPath({
      class: `patchline ${this.#isDiff && line.diffState ? line.diffState : ""}`,
      d: `M ${sX} ${sY} C ${sX} ${sY + c}, ${dX} ${dY - c}, ${dX} ${dY}`,
      "data-src": line.source[0],
      "data-dst": line.destination[0],
    });
  }

  // ── Box Element Factory ────────────────────────────────────────────────────

  #createBoxEl(box) {
    const tag = BOX_TAG[box.maxclass] ?? "max-box";
    const el = document.createElement(tag);
    el.id = `box-${box.id}`;
    if (this.#isPresentation) el.setAttribute("presentation", "");
    el.data = box;

    el.addEventListener("click", (e) => this.#onBoxClick(e, el, box));
    el.addEventListener("dblclick", (e) => this.#onBoxDblClick(e, box));
    this.#makeDraggable(el, box);
    return el;
  }

  #onBoxClick(e, el, box) {
    if (el.dataset["dragged"]) return;
    this.dispatchEvent(
      new CustomEvent("box-click", {
        detail: { box, originalEvent: e },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onBoxDblClick(e, box) {
    this.dispatchEvent(
      new CustomEvent("box-dblclick", {
        detail: { box, originalEvent: e },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ── Dragging ───────────────────────────────────────────────────────────────

  #makeDraggable(el, box) {
    let startX = 0,
      startY = 0;
    let initX = 0,
      initY = 0;
    let rafId = null;

    const onMove = (e) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const zoom = this.zoomLevel;
        const nx = initX + (e.clientX - startX) / zoom;
        const ny = initY + (e.clientY - startY) / zoom;
        if (nx === initX && ny === initY) return;

        el.dataset["dragged"] = "true";
        const rectProp =
          this.#isPresentation && box.presentation_rect
            ? "presentation_rect"
            : "patching_rect";

        if (!box[rectProp]) box[rectProp] = [0, 0, 0, 0];
        box[rectProp][0] = nx;
        box[rectProp][1] = ny;

        el.style.left = `${nx}px`;
        el.style.top = `${ny}px`;

        const right = nx + parseFloat(el.style.width || "0");
        const bottom = ny + parseFloat(el.style.height || "0");
        if (right > parseFloat(this.style.width || "0"))
          this.style.width = `${right + 20}px`;
        if (bottom > parseFloat(this.style.height || "0"))
          this.style.height = `${bottom + 20}px`;

        this.#renderLines();
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setTimeout(() => {
        delete el.dataset["dragged"];
      }, 0);
    };

    el.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      initX = parseFloat(el.style.left || "0");
      initY = parseFloat(el.style.top || "0");
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    });
  }
}

// ─── Custom Element Registration ──────────────────────────────────────────────

const ELEMENTS = {
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

for (const [name, ctor] of Object.entries(ELEMENTS)) {
  if (!customElements.get(name)) customElements.define(name, ctor);
}
