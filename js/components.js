
export class MaxBox extends HTMLElement {
    #data = null;
    static #baseStyleSheet = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (!MaxBox.#baseStyleSheet) {
            MaxBox.#baseStyleSheet = new CSSStyleSheet();
            MaxBox.#baseStyleSheet.replaceSync(this.getBaseStyles());
        }
        this.shadowRoot.adoptedStyleSheets = [MaxBox.#baseStyleSheet];
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
        const attrs = box.saved_attribute_attributes?.valueof || {};
        const pretty = attrs.parameter_longname || attrs.parameter_shortname;
        const basic = box.text || box.maxclass;
        const main = (box.maxclass === "bpatcher" && box.name) ? `${pretty || basic} ${box.name}` : (pretty || basic);
        const sub = (pretty && pretty !== basic) ? basic : null;
        return { main, sub };
    }

    getInletsOutlets() {
        const { numinlets = 1, numoutlets = 1 } = this.#data;
        const createPoints = (num, className) => Array.from({ length: num }, (_, i) => {
            const left = `${(100 / (num + 1)) * (i + 1)}%`;
            return `<div class="${className}" part="${className}" style="left: ${left}"></div>`;
        }).join('');
        return createPoints(numinlets, 'inlet-point') + createPoints(numoutlets, 'outlet-point');
    }

    getBaseStyles() {
        return `
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
            }
            .inlet-point { top: -2px; }
            .outlet-point { bottom: -2px; }

            .info-indicator {
                position: absolute;
                top: -8px; right: -8px;
                width: 16px; height: 16px;
                background-color: var(--accent-moved, #2196f3);
                color: white;
                border-radius: 50%;
                font-size: 8px;
                display: flex; align-items: center; justify-content: center;
                font-weight: bold;
                z-index: 20;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }

            .box-content {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                width: 100%; height: 100%;
                pointer-events: none;
            }
            .main-text { font-weight: normal; white-space: pre-wrap; }
            .sub-text { font-size: 8px; opacity: 0.6; margin-top: 2px; font-style: italic; white-space: pre-wrap; }
            .diff-text-container { display: flex; flex-direction: column; align-items: center; line-height: 1.2; width: 100%; }
            .diff-old-text { text-decoration: line-through; color: var(--accent-removed, #f44336); font-size: 8px; opacity: 0.8; white-space: pre-wrap; }
            .diff-new-text { color: var(--accent-added, #4caf50); font-weight: bold; white-space: pre-wrap; }
        `;
    }

    getStyles() { return ''; }

    getContent() {
        const { main, sub } = this.getDisplayName();
        const { diffState, oldText, text, maxclass } = this.#data;
        const isModified = diffState === "modified";
        
        let contentHtml = (isModified && oldText && oldText !== (text || maxclass) && !sub) 
            ? `<div class="diff-text-container" part="diff-container">
                    <div class="diff-old-text" part="diff-old-text">${oldText}</div>
                    <div class="diff-new-text" part="diff-new-text">${main}</div>
               </div>`
            : `<span class="main-text" part="main-text">${main}</span>`;

        if (sub) contentHtml += `<span class="sub-text" part="sub-text">(${sub})</span>`;
        return `<div class="box-content" part="content">${contentHtml}</div>`;
    }

    render() {
        if (!this.#data) return;
        const { maxclass = "", diffState = "", patcher, patcherA, patcherB, attrDiffs } = this.#data;
        const hasSubpatch = diffState !== "" ? (patcherA || patcherB) : patcher;

        this.className = `max-box ${maxclass} ${diffState}`;

        const extraStyles = new CSSStyleSheet();
        let styles = this.getStyles();
        if (hasSubpatch) styles += `:host { border-style: double !important; border-width: 3px !important; }`;
        extraStyles.replaceSync(styles);
        this.shadowRoot.adoptedStyleSheets = [MaxBox.#baseStyleSheet, extraStyles];

        const indicator = (diffState === 'modified' && attrDiffs?.length > 0) 
            ? `<div class="info-indicator" part="info-indicator">i</div>` 
            : '';

        this.shadowRoot.innerHTML = `${this.getContent()}${this.getInletsOutlets()}${indicator}`;
    }
}

export class MaxMessage extends MaxBox {
    getStyles() { return `:host { background-color: var(--bg-message, #555); border-radius: 10px; }`; }
}

export class MaxComment extends MaxBox {
    getStyles() { return `:host { background-color: transparent; border: none; }`; }
}

export class MaxButton extends MaxBox {
    getStyles() {
        return `:host { padding: 0; }
            .bang-circle {
                width: 80%; height: 80%;
                border-radius: 50%;
                border: 1.5px solid var(--border-box, #666);
                box-sizing: border-box;
                pointer-events: none;
            }
            :host(.added) .bang-circle { border-color: var(--accent-added, #4caf50); }
            :host(.removed) .bang-circle { border-color: var(--accent-removed, #f44336); }
            :host(.modified) .bang-circle { border-color: var(--accent-modified, #ff9800); }`;
    }
    getContent() { return `<div class="bang-circle" part="bang-circle"></div>`; }
}

export class MaxIO extends MaxBox {
    getStyles() {
        return `:host { padding: 0; min-width: 20px; min-height: 20px; background-color: var(--bg-box, #333); border: 1px solid var(--border-box, #666); }
            .io-number { border: none; background-color: transparent; font-weight: bold; font-size: 8px; color: var(--text-muted, #ccc); line-height: 1; margin: 1px 0; }
            .io-triangle { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--io-color, #888); margin: 2px 0; }`;
    }
    getContent() {
        const b = this.data;
        const num = `<div class="io-number" part="io-number">${b.index || 1}</div>`;
        const tri = `<div class="io-triangle" part="io-triangle"></div>`;
        return `<div class="box-content" part="content">${b.maxclass === "inlet" ? num + tri : tri + num}</div>`;
    }
}

export class MaxPanel extends MaxBox {
    getStyles() { return `:host { z-index: 5; }`; }
}

export class MaxInlet extends MaxIO {}
export class MaxOutlet extends MaxIO {}

const elements = {
    'max-box': MaxBox,
    'max-message': MaxMessage,
    'max-comment': MaxComment,
    'max-button': MaxButton,
    'max-inlet': MaxInlet,
    'max-outlet': MaxOutlet,
    'max-panel': MaxPanel
};

for (const [name, constructor] of Object.entries(elements)) {
    if (!customElements.get(name)) customElements.define(name, constructor);
}
