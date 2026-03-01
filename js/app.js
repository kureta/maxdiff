import './components.js';
import { DiffEngine } from './DiffEngine.js';
import { PatcherRenderer } from './PatcherRenderer.js';

class PatcherApp {
    #dom = {
        container: document.getElementById("patcher-container"),
        svgLayer: document.getElementById("patchline-svg"),
        fileInputsDiv: document.getElementById("file-inputs"),
        viewToggles: document.getElementById("view-toggles"),
        wrapper: document.getElementById("patcher-wrapper"),
        modal: document.getElementById("details-modal"),
        modalContent: document.getElementById("diff-content"),
        closeButton: document.querySelector(".close-button"),
        metadataSidebar: document.getElementById("metadata-sidebar"),
        metadataContent: document.getElementById("metadata-content"),
        btnMetadata: document.getElementById("btn-metadata"),
        btnCloseSidebar: document.getElementById("btn-close-sidebar"),
        fileInputA: document.getElementById("fileInputA"),
        fileInputB: document.getElementById("fileInputB"),
        btnResetLayout: document.getElementById("btn-reset-layout"),
        btnZoomIn: document.getElementById("btn-zoom-in"),
        btnZoomOut: document.getElementById("btn-zoom-out"),
        btnZoomReset: document.getElementById("btn-zoom-reset"),
        controls: document.getElementById("controls"),
        presentationToggle: document.getElementById("presentation-toggle")
    };

    #state = {
        dataA: null,
        dataB: null,
        currentDiffData: null,
        zoomLevel: 1.0,
        navStack: []
    };

    constructor() {
        this.renderer = new PatcherRenderer(this.#dom.container, this.#dom.svgLayer);
        this.btnBack = this.#createBackButton();
        this.#init();
    }

    #createBackButton() {
        const btn = document.createElement("button");
        Object.assign(btn, { id: "btn-back", textContent: "Back to Parent", style: "display: none;" });
        this.#dom.controls.appendChild(btn);
        return btn;
    }

    #init() {
        this.#initEventListeners();
        this.#checkLocalServer();
    }

    #initEventListeners() {
        const d = this.#dom;
        d.presentationToggle.addEventListener("change", () => this.updateView());
        d.closeButton.addEventListener("click", () => d.modal.style.display = "none");
        window.addEventListener("click", e => { if (e.target === d.modal) d.modal.style.display = "none"; });
        window.addEventListener("pagehide", () => navigator.sendBeacon("/shutdown"));

        this.btnBack.addEventListener("click", () => this.#navigateBack());
        d.btnMetadata.addEventListener("click", () => d.metadataSidebar.classList.toggle("open"));
        d.btnCloseSidebar.addEventListener("click", () => d.metadataSidebar.classList.remove("open"));

        document.querySelectorAll('input[name="view"]').forEach(radio => {
            radio.addEventListener("change", () => this.updateView());
        });

        const handleFile = (key) => (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => {
                this.#state[key] = JSON.parse(re.target.result);
                this.#handleDataUpdate();
            };
            reader.readAsText(file);
        };

        d.fileInputA.addEventListener("change", handleFile('dataA'));
        d.fileInputB.addEventListener("change", handleFile('dataB'));

        d.btnResetLayout.addEventListener("click", () => {
            this.setZoom(1.0);
            d.wrapper.scrollTo(0, 0);
            d.modal.style.display = "none";
            d.metadataSidebar.classList.remove("open");
            this.#handleDataUpdate();
        });

        d.btnZoomIn.addEventListener("click", () => this.setZoom(this.#state.zoomLevel * 1.1));
        d.btnZoomOut.addEventListener("click", () => this.setZoom(this.#state.zoomLevel / 1.1));
        d.btnZoomReset.addEventListener("click", () => this.setZoom(1.0));

        d.wrapper.addEventListener("wheel", e => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const factor = e.deltaY > 0 ? 1 / 1.05 : 1.05;
                this.setZoom(this.#state.zoomLevel * factor, { x: e.clientX, y: e.clientY });
            }
        }, { passive: false });
    }

    async #checkLocalServer() {
        try {
            const res = await fetch("/diff-data");
            if (res.ok) {
                const data = await res.json();
                this.#dom.fileInputsDiv.style.display = "none";
                if (data.filename) document.title = `Diff: ${data.filename}`;
                [this.#state.dataA, this.#state.dataB] = [data.old, data.new];
                this.#handleDataUpdate();
            }
        } catch (e) {}
    }

    #handleDataUpdate() {
        if (!this.#state.dataA && !this.#state.dataB) return;
        this.#state.currentDiffData = DiffEngine.compare(this.#state.dataA, this.#state.dataB);
        this.#dom.viewToggles.style.display = "block";
        this.#dom.btnMetadata.style.display = "inline-block";
        this.updateView();
    }

    updateView() {
        const mode = document.querySelector('input[name="view"]:checked')?.value || 'diff';
        const isPres = this.#dom.presentationToggle.checked;
        const cb = {
            onShowDetails: (box) => this.#showDetails(box),
            onNavigateToSubpatch: (pA, pB) => this.#navigateToSubpatch(pA, pB),
            onMakeDraggable: (el, onDrag) => this.#makeDraggable(el, onDrag)
        };

        let hasMeta = false;
        if (mode === "before" && this.#state.dataA) {
            const { boxes, lines } = DiffEngine.normalize(this.#state.dataA);
            this.renderer.render(boxes, lines, false, isPres, cb);
            const meta = DiffEngine.getMetadata(this.#state.dataA);
            this.#renderSingleMeta(meta);
            hasMeta = Object.keys(meta).length > 0;
        } else if (mode === "after" && this.#state.dataB) {
            const { boxes, lines } = DiffEngine.normalize(this.#state.dataB);
            this.renderer.render(boxes, lines, false, isPres, cb);
            const meta = DiffEngine.getMetadata(this.#state.dataB);
            this.#renderSingleMeta(meta);
            hasMeta = Object.keys(meta).length > 0;
        } else if (mode === "diff" && this.#state.currentDiffData) {
            this.renderer.render(this.#state.currentDiffData.boxes, this.#state.currentDiffData.lines, true, isPres, cb);
            const diffs = DiffEngine.compareMetadata(this.#state.dataA, this.#state.dataB);
            this.#renderMetaDiffs(diffs);
            hasMeta = diffs.length > 0;
        }

        this.#dom.btnMetadata.disabled = !hasMeta;
        if (!hasMeta) this.#dom.metadataSidebar.classList.remove("open");
    }

    #navigateToSubpatch(pA, pB) {
        this.#state.navStack.push({ dataA: this.#state.dataA, dataB: this.#state.dataB });
        this.btnBack.style.display = "inline-block";
        [this.#state.dataA, this.#state.dataB] = [pA ? { patcher: pA } : null, pB ? { patcher: pB } : null];
        this.#handleDataUpdate();
    }

    #navigateBack() {
        const prevState = this.#state.navStack.pop();
        if (this.#state.navStack.length === 0) this.btnBack.style.display = "none";
        Object.assign(this.#state, prevState);
        this.#handleDataUpdate();
    }

    #showDetails(box) {
        this.#dom.modalContent.innerHTML = "";
        if (box.diffState !== "modified" || !box.attrDiffs?.length) return;

        box.attrDiffs.forEach(d => {
            if (d.key === "saved_attribute_attributes") {
                const oldA = d.old?.valueof || {}, newA = d.new?.valueof || {};
                [...new Set([...Object.keys(oldA), ...Object.keys(newA)])].forEach(k => {
                    if (JSON.stringify(oldA[k]) !== JSON.stringify(newA[k])) {
                        this.#createAttrChange(`saved_attribute_attributes -> ${k}`, JSON.stringify(oldA[k]), JSON.stringify(newA[k]));
                    }
                });
            } else {
                this.#createAttrChange(d.key, JSON.stringify(d.old), JSON.stringify(d.new));
            }
        });
        if (this.#dom.modalContent.children.length) this.#dom.modal.style.display = "block";
    }

    #createAttrChange(key, oldV, newV) {
        const div = document.createElement("div");
        div.className = "attr-change";
        div.innerHTML = `<div class="attr-name">${key}</div><span class="attr-old">${oldV}</span><span class="attr-new">${newV}</span>`;
        this.#dom.modalContent.appendChild(div);
    }

    #renderMetaDiffs(diffs) {
        this.#dom.metadataContent.innerHTML = diffs.map(d => `
            <div class="meta-change"><div class="meta-key">${d.key}</div>
                <pre class="meta-old">${JSON.stringify(d.old, null, 2)}</pre>
                <pre class="meta-new">${JSON.stringify(d.new, null, 2)}</pre>
            </div>`).join("");
    }

    #renderSingleMeta(meta) {
        this.#dom.metadataContent.innerHTML = Object.entries(meta).map(([k, v]) => `
            <div class="meta-change"><div class="meta-key">${k}</div>
                <pre class="meta-new">${JSON.stringify(v, null, 2)}</pre>
            </div>`).join("");
    }

    setZoom(level, pivot) {
        level = Math.max(0.2, Math.min(level, 3.0));
        if (level === this.#state.zoomLevel) return;

        const w = this.#dom.wrapper;
        const rect = w.getBoundingClientRect();
        const px = pivot ? pivot.x - rect.left : w.clientWidth / 2;
        const py = pivot ? pivot.y - rect.top : w.clientHeight / 2;

        const ratio = level / this.#state.zoomLevel;
        w.scrollLeft = (px + w.scrollLeft) * ratio - px;
        w.scrollTop = (py + w.scrollTop) * ratio - py;

        this.#state.zoomLevel = level;
        this.#dom.container.style.transform = `scale(${level})`;
        this.#dom.btnZoomReset.textContent = `${Math.round(level * 100)}%`;
    }

    #makeDraggable(el, onDrag) {
        let dragging = false, startX, startY, initialL, initialT, moved = false;

        const onMove = e => {
            if (!dragging) return;
            const dx = (e.clientX - startX) / this.#state.zoomLevel, dy = (e.clientY - startY) / this.#state.zoomLevel;
            if (dx === 0 && dy === 0) return;
            moved = true;
            const nx = initialL + dx, ny = initialT + dy;
            el.style.left = `${nx}px`; el.style.top = `${ny}px`;
            if (onDrag) onDrag(nx, ny);
        };

        const onUp = () => {
            if (dragging) {
                dragging = false;
                if (moved) {
                    el.dataset.dragged = "true";
                    setTimeout(() => delete el.dataset.dragged, 0);
                }
                window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp);
            }
        };

        el.addEventListener("mousedown", e => {
            if (e.button !== 0) return;
            dragging = true; moved = false;
            startX = e.clientX; startY = e.clientY;
            initialL = parseFloat(el.style.left); initialT = parseFloat(el.style.top);
            window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
        });
    }
}

new PatcherApp();
