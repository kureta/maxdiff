const boxStyles = new CSSStyleSheet();
boxStyles.replaceSync(`
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
        transition: border-color 0.2s, color 0.2s;
    }
    :host(:hover) { border-color: var(--border-hover, #999); }
    :host(.added) { border-color: var(--accent-added, #4caf50) !important; color: var(--accent-added, #4caf50) !important; }
    :host(.removed) { border-color: var(--accent-removed, #f44336) !important; color: var(--accent-removed, #f44336) !important; opacity: 0.6; }
    :host(.modified) { border-color: var(--accent-modified, #ff9800) !important; color: var(--accent-modified, #ff9800) !important; }
    :host(.moved) { border-color: var(--accent-moved, #2196f3) !important; color: var(--accent-moved, #2196f3) !important; border-style: dashed !important; }
    
    .inlet-point, .outlet-point {
        position: absolute;
        width: 8px;
        height: 4px;
        background-color: var(--io-color, #888);
        border-radius: 2px;
        transform: translateX(-50%);
        z-index: 15;
    }
    .inlet-point.added, .outlet-point.added { background-color: var(--accent-added, #4caf50) !important; }
    .inlet-point.removed, .outlet-point.removed { background-color: var(--accent-removed, #f44336) !important; opacity: 0.4; z-index: 14; }
    :host(.added) .inlet-point, :host(.added) .outlet-point { background-color: var(--accent-added, #4caf50); }
    :host(.removed) .inlet-point, :host(.removed) .outlet-point { background-color: var(--accent-removed, #f44336); }
    
    .inlet-point { top: -2px; }
    .outlet-point { bottom: -2px; }

    .info-indicator {
        position: absolute;
        top: -8px; right: -8px;
        width: 16px; height: 16px;
        background-color: var(--accent-moved, #2196f3);
        color: white;
        border-radius: 50%;
        font-size: 10px;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold;
        z-index: 20;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        transition: transform 0.1s;
    }
    .info-indicator:hover {
        transform: scale(1.2);
        filter: brightness(1.1);
    }

    .box-content {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 100%; height: 100%;
        pointer-events: none;
    }
    .main-text { font-weight: normal; white-space: pre-wrap; text-align: center; }
    .sub-text { font-size: 8px; opacity: 0.6; margin-top: 2px; font-style: italic; white-space: pre-wrap; }
    .diff-text-container { display: flex; flex-direction: column; align-items: center; line-height: 1.2; width: 100%; }
    .diff-old-text { text-decoration: line-through; color: var(--accent-removed, #f44336); font-size: 8px; opacity: 0.8; white-space: pre-wrap; }
    .diff-new-text { color: var(--accent-added, #4caf50); font-weight: bold; white-space: pre-wrap; }
`);

const messageStyle = new CSSStyleSheet();
messageStyle.replaceSync(`:host { background-color: var(--bg-message, #555); border-radius: 10px; }`);

const commentStyle = new CSSStyleSheet();
commentStyle.replaceSync(`:host { background-color: transparent; border: none; }`);

const buttonStyle = new CSSStyleSheet();
buttonStyle.replaceSync(`
    :host { padding: 0; }
    .bang-circle {
        width: 80%; height: 80%;
        border-radius: 50%;
        border: 1.5px solid var(--border-box, #666);
        box-sizing: border-box;
        pointer-events: none;
    }
    :host(.added) .bang-circle { border-color: var(--accent-added, #4caf50); }
    :host(.removed) .bang-circle { border-color: var(--accent-removed, #f44336); }
    :host(.modified) .bang-circle { border-color: var(--accent-modified, #ff9800); }
`);

const ioStyle = new CSSStyleSheet();
ioStyle.replaceSync(`
    :host { padding: 0; min-width: 20px; min-height: 20px; }
    .io-number { border: none; background-color: transparent; font-weight: bold; font-size: 8px; color: var(--text-muted, #ccc); line-height: 1; margin: 1px 0; }
    .io-triangle { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--io-color, #888); margin: 2px 0; }
`);

const panelStyle = new CSSStyleSheet();
panelStyle.replaceSync(`:host { z-index: 5; }`);

const patcherStyle = new CSSStyleSheet();
patcherStyle.replaceSync(`
    :host {
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
    .patchline.added { stroke: var(--accent-added, #4caf50); }
    .patchline.removed { stroke: var(--accent-removed, #f44336); stroke-dasharray: 5, 5; }
    .patchline.modified { stroke: var(--accent-modified, #ff9800); }
    .patchline.moved { stroke: var(--accent-moved, #2196f3); stroke-dasharray: 2, 2; }
`);

/**
 * Base class for all Max objects.
 */
export class MaxBox extends HTMLElement {
    #data = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [boxStyles];
    }

    static get observedAttributes() { return ['presentation']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'presentation' && oldValue !== newValue) this.updatePosition();
    }

    set data(value) {
        this.#data = value;
        this.updatePosition();
        this.render();
    }

    get data() { return this.#data; }

    updatePosition() {
        if (!this.#data) return;
        const rect = this.hasAttribute('presentation') && this.#data.presentation_rect
            ? this.#data.presentation_rect
            : this.#data.patching_rect;
        if (!rect) return;

        const [x, y, w, h] = rect;
        Object.assign(this.style, {
            left: `${x}px`,
            top: `${y}px`,
            width: `${w}px`,
            height: `${h}px`
        });
    }

    getDisplayName() {
        const box = this.#data;
        const attrs = box.saved_attribute_attributes?.valueof ?? {};
        const pretty = attrs.parameter_longname ?? attrs.parameter_shortname;
        const basic = box.text ?? box.maxclass;

        const main = (box.maxclass === "bpatcher" && box.name)
            ? `${pretty ?? basic} ${box.name}`
            : (pretty ?? basic);
        const sub = (pretty && pretty !== basic) ? basic : null;

        return { main, sub };
    }

    getInletsOutlets() {
        const { numinlets = 1, numoutlets = 1, attrDiffs = [], diffState } = this.#data;
        const createPoints = (num, className, stateClass = '') => Array.from({ length: num }, (_, i) => {
            const left = `${(100 / (num + 1)) * (i + 1)}%`;
            return `<div class="${className} ${stateClass}" style="left: ${left}"></div>`;
        }).join('');

        let inletsHtml = '';
        const inletDiff = diffState === 'modified' ? attrDiffs.find(d => d.key === 'numinlets') : null;
        if (inletDiff) {
            inletsHtml = createPoints(inletDiff.old ?? 1, 'inlet-point', 'removed') +
                         createPoints(inletDiff.new ?? 1, 'inlet-point', 'added');
        } else {
            inletsHtml = createPoints(numinlets, 'inlet-point');
        }

        let outletsHtml = '';
        const outletDiff = diffState === 'modified' ? attrDiffs.find(d => d.key === 'numoutlets') : null;
        if (outletDiff) {
            outletsHtml = createPoints(outletDiff.old ?? 1, 'outlet-point', 'removed') +
                          createPoints(outletDiff.new ?? 1, 'outlet-point', 'added');
        } else {
            outletsHtml = createPoints(numoutlets, 'outlet-point');
        }

        return inletsHtml + outletsHtml;
    }

    getContent() {
        const { main, sub } = this.getDisplayName();
        const { diffState, oldText, text, maxclass } = this.#data;
        const isModified = diffState === "modified";

        let contentHtml = (isModified && oldText && oldText !== (text ?? maxclass) && !sub)
            ? `<div class="diff-text-container">
                    <div class="diff-old-text">${oldText}</div>
                    <div class="diff-new-text">${main}</div>
               </div>`
            : `<span class="main-text">${main}</span>`;

        if (sub) contentHtml += `<span class="sub-text">(${sub})</span>`;
        return `<div class="box-content">${contentHtml}</div>`;
    }

    render() {
        if (!this.#data) return;
        const { maxclass = "", diffState = "", patcher, patcherA, patcherB, attrDiffs } = this.#data;
        const hasSubpatch = diffState !== "" ? (patcherA || patcherB) : patcher;

        this.className = `max-box ${maxclass} ${diffState}`;

        if (hasSubpatch) {
            this.style.borderStyle = 'double';
            this.style.borderWidth = '3px';
        }

        const indicator = (diffState === 'modified' && attrDiffs?.length > 0)
            ? `<div class="info-indicator">i</div>`
            : '';

        this.shadowRoot.innerHTML = `${this.getContent()}${this.getInletsOutlets()}${indicator}`;
    }
}

export class MaxMessage extends MaxBox {
    constructor() {
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, messageStyle];
    }
}

export class MaxComment extends MaxBox {
    constructor() {
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, commentStyle];
    }
}

export class MaxButton extends MaxBox {
    constructor() {
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, buttonStyle];
    }
    getContent() { return `<div class="bang-circle"></div>`; }
}

export class MaxIO extends MaxBox {
    constructor() {
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, ioStyle];
    }
    getContent() {
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
        super();
        this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, panelStyle];
    }
}

/**
 * Main patcher component that renders boxes and lines.
 */
export class MaxPatcher extends HTMLElement {
    #boxes = [];
    #lines = [];
    #isDiff = false;
    #isPresentation = false;
    #boxMap = new Map();

    static get observedAttributes() { return ['presentation', 'diff']; }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [patcherStyle];
        this.shadowRoot.innerHTML = `
            <div id="container"></div>
            <svg id="svg-layer"></svg>
        `;
        this.container = this.shadowRoot.getElementById('container');
        this.svgLayer = this.shadowRoot.getElementById('svg-layer');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'presentation') {
            this.#isPresentation = newValue !== null;
            this.render();
        } else if (name === 'diff') {
            this.#isDiff = newValue !== null;
            this.render();
        }
    }

    set patchData({ boxes, lines }) {
        this.#boxes = boxes;
        this.#lines = lines;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.svgLayer.innerHTML = '';
        this.#boxMap.clear();

        let maxX = 0, maxY = 0;

        const visibleBoxes = this.#boxes.filter(b => !this.#isPresentation || b.presentation || (b.diffState === 'removed' && b.presentation_rect));

        for (const box of visibleBoxes) {
            this.#boxMap.set(box.id, box);
            const rect = (this.#isPresentation && box.presentation_rect) ? box.presentation_rect : box.patching_rect;
            if (!rect) continue;

            maxX = Math.max(maxX, rect[0] + rect[2]);
            maxY = Math.max(maxY, rect[1] + rect[3]);

            const el = this.createBoxElement(box);
            this.container.appendChild(el);
        }

        this.style.width = `${maxX + 200}px`;
        this.style.height = `${maxY + 200}px`;

        this.updateLines();
    }

    updateLines() {
        this.svgLayer.innerHTML = '';
        for (const line of this.#lines) {
            const src = this.#boxMap.get(line.source[0]);
            const dst = this.#boxMap.get(line.destination[0]);
            if (src && dst) {
                const path = this.createConnectionPath(src, dst, line);
                if (this.#isDiff && line.diffState) {
                    path.classList.add(line.diffState);
                }
                this.svgLayer.appendChild(path);
            }
        }
    }

    createConnectionPath(src, dst, line) {
        const sR = (this.#isPresentation && src.presentation_rect) ? src.presentation_rect : src.patching_rect;
        const dR = (this.#isPresentation && dst.presentation_rect) ? dst.presentation_rect : dst.patching_rect;

        // If we can't find rects (e.g. subpatch navigation issue), skip
        if (!sR || !dR) return document.createElementNS("http://www.w3.org/2000/svg", "path");

        const sX = sR[0] + (sR[2] / ((src.numoutlets ?? 1) + 1)) * (line.source[1] + 1);
        const sY = sR[1] + sR[3];
        const dX = dR[0] + (dR[2] / ((dst.numinlets ?? 1) + 1)) * (line.destination[1] + 1);
        const dY = dR[1];

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "patchline");
        const off = Math.max(20, Math.abs(dY - sY) * 0.4);
        path.setAttribute("d", `M ${sX} ${sY} C ${sX} ${sY + off}, ${dX} ${dY - off}, ${dX} ${dY}`);

        path.dataset.src = line.source[0];
        path.dataset.dst = line.destination[0];

        return path;
    }

    createBoxElement(box) {
        const tag = {
            message: 'max-message',
            comment: 'max-comment',
            button: 'max-button',
            inlet: 'max-inlet',
            outlet: 'max-outlet',
            panel: 'max-panel',
            "bach.roll": 'max-panel',
            "bach.score": 'max-panel'
        }[box.maxclass] ?? 'max-box';

        const el = document.createElement(tag);
        if (this.#isPresentation) el.setAttribute('presentation', '');
        el.data = box;

        el.addEventListener('click', (e) => {
            if (el.dataset.dragged) return;
            this.dispatchEvent(new CustomEvent('box-click', {
                detail: { box, originalEvent: e },
                bubbles: true,
                composed: true
            }));
        });

        el.addEventListener('dblclick', (e) => {
            this.dispatchEvent(new CustomEvent('box-dblclick', {
                detail: { box, originalEvent: e },
                bubbles: true,
                composed: true
            }));
        });

        this.makeDraggable(el, box);

        return el;
    }

    makeDraggable(el, box) {
        let startX, startY, initialPos;
        let rafId = null;

        const onMouseMove = (e) => {
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

                const rectProp = this.#isPresentation && box.presentation_rect ? 'presentation_rect' : 'patching_rect';
                if (!box[rectProp]) box[rectProp] = [0, 0, 0, 0];
                [box[rectProp][0], box[rectProp][1]] = [nx, ny];

                el.style.left = `${nx}px`;
                el.style.top = `${ny}px`;

                // Expand patcher if needed
                const right = nx + parseFloat(el.style.width || 0);
                const bottom = ny + parseFloat(el.style.height || 0);
                const currentW = parseFloat(this.style.width || 0);
                const currentH = parseFloat(this.style.height || 0);

                if (right > currentW) this.style.width = `${right + 20}px`;
                if (bottom > currentH) this.style.height = `${bottom + 20}px`;

                this.updateLines();
                rafId = null;
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            setTimeout(() => delete el.dataset.dragged, 0);
        };

        el.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            startX = e.clientX;
            startY = e.clientY;
            initialPos = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            e.stopPropagation();
        });
    }

    get zoomLevel() {
        const matrix = new DOMMatrix(getComputedStyle(this).transform);
        return matrix.a || 1;
    }
}

const elements = {
    'max-box': MaxBox,
    'max-message': MaxMessage,
    'max-comment': MaxComment,
    'max-button': MaxButton,
    'max-inlet': MaxInlet,
    'max-outlet': MaxOutlet,
    'max-panel': MaxPanel,
    'max-patcher': MaxPatcher
};

for (const [name, constructor] of Object.entries(elements)) {
    if (!customElements.get(name)) customElements.define(name, constructor);
}
