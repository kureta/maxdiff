import './components.js';
import {StateManager} from './StateManager.js';

/**
 * Main application controller for the Max Patch Diff Tool.
 */
class PatcherApp {
    #state = new StateManager();
    #elements = {
        patcher: document.getElementById('patcher'),
        wrapper: document.getElementById('patcher-wrapper'),
        fileInputs: document.getElementById('file-inputs'),
        viewToggles: document.getElementById('view-toggles'),
        presentationToggle: document.getElementById('presentation-toggle'),
        btnResetLayout: document.getElementById('btn-reset-layout'),
        btnMetadata: document.getElementById('btn-metadata'),
        modal: document.getElementById('details-modal'),
        modalContent: document.getElementById('diff-content'),
        closeModal: document.querySelector('.close-button'),
        sidebar: document.getElementById('metadata-sidebar'),
        sidebarContent: document.getElementById('metadata-content'),
        closeSidebar: document.getElementById('btn-close-sidebar'),
        btnZoomIn: document.getElementById('btn-zoom-in'),
        btnZoomOut: document.getElementById('btn-zoom-out'),
        btnZoomReset: document.getElementById('btn-zoom-reset'),
        controls: document.getElementById('controls')
    };

    #btnBack = null;

    constructor() {
        this.#init();
    }

    async #init() {
        this.#btnBack = this.#createBackButton();
        this.#setupEventListeners();
        await this.#loadInitialData();
    }

    #createBackButton() {
        const btn = document.createElement('button');
        Object.assign(btn, {
            id: 'btn-back',
            textContent: 'Back to Parent',
            hidden: true
        });
        this.#elements.controls.appendChild(btn);
        return btn;
    }

    #setupEventListeners() {
        const {
            presentationToggle, closeModal, modal, sidebar,
            closeSidebar, btnMetadata, btnResetLayout,
            btnZoomIn, btnZoomOut, btnZoomReset, wrapper,
            patcher
        } = this.#elements;

        presentationToggle.onchange = () => this.#state.togglePresentation(presentationToggle.checked);

        const closeM = () => modal.style.display = 'none';
        closeModal.onclick = closeM;
        window.onclick = (e) => {
            if (e.target === modal) closeM();
        };

        btnMetadata.onclick = () => sidebar.classList.toggle('open');
        closeSidebar.onclick = () => sidebar.classList.remove('open');

        document.querySelectorAll('input[name="view"]').forEach(radio => {
            radio.onchange = () => this.#state.setViewMode(radio.value);
        });

        const handleFile = (key) => async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const data = JSON.parse(await file.text());
            if (key === 'dataA') this.#state.setFileA(data);
            else this.#state.setFileB(data);
        };

        document.getElementById('fileInputA').onchange = handleFile('dataA');
        document.getElementById('fileInputB').onchange = handleFile('dataB');

        btnResetLayout.onclick = () => {
            this.#state.resetLayout();
            closeM();
            sidebar.classList.remove('open');
        };

        btnZoomIn.onclick = () => this.#state.setZoom(this.#state.state.zoomLevel * 1.1);
        btnZoomOut.onclick = () => this.#state.setZoom(this.#state.state.zoomLevel / 1.1);
        btnZoomReset.onclick = () => this.#state.setZoom(1.0);

        wrapper.onwheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const factor = e.deltaY > 0 ? 1 / 1.05 : 1.05;
                this.#state.setZoom(this.#state.state.zoomLevel * factor, {x: e.clientX, y: e.clientY});
            }
        };

        this.#btnBack.onclick = () => this.#state.popSubpatch();

        patcher.addEventListener('box-click', (e) => {
            const {box, originalEvent} = e.detail;
            const isIndicator = originalEvent.composedPath().some(el => el.classList?.contains('info-indicator'));
            if (isIndicator) this.#handleBoxClick(box);
        });
        patcher.addEventListener('box-dblclick', (e) => {
            const {box, originalEvent} = e.detail;
            const isIndicator = originalEvent.composedPath().some(el => el.classList?.contains('info-indicator'));
            if (!isIndicator) this.#handleBoxDblClick(box);
        });

        window.onpagehide = () => navigator.sendBeacon('/shutdown');

        this.#state.addEventListener('state-change', (e) => this.#onStateChange(e.detail));
    }

    async #loadInitialData() {
        try {
            const res = await fetch('/diff-data');
            if (res.ok) {
                const data = await res.json();
                this.#elements.fileInputs.hidden = true;
                if (data.filename) document.title = `Diff: ${data.filename}`;
                this.#state.setInitialData(data.old, data.new);
            }
        } catch (e) {
            console.warn('Local server not found, falling back to file inputs.');
        }
    }

    #onStateChange({type, state, pivot}) {
        if (type === 'data' || type === 'navigation') {
            this.#elements.viewToggles.style.display = 'block';
            this.#elements.btnMetadata.style.display = 'inline-block';
            this.#btnBack.hidden = state.navStack.length === 0;
            this.#updateView(state);
        } else if (type === 'view') {
            this.#updateView(state);
        } else if (type === 'zoom') {
            this.#applyZoom(state.zoomLevel, pivot);
        } else if (type === 'layout-reset') {
            this.#applyZoom(1.0);
            this.#elements.wrapper.scrollTo(0, 0);
        }
    }

    #updateView(state) {
        const {patcher, presentationToggle} = this.#elements;
        const mode = state.viewMode;
        const isPres = state.isPresentation;

        patcher.toggleAttribute('presentation', isPres);
        patcher.toggleAttribute('diff', mode === 'diff');

        const renderData = this.#state.currentRenderData;
        patcher.patchData = renderData;

        const {diffs, meta} = this.#state.currentMetadata;
        this.#renderMetadata(meta, diffs);
    }

    #handleBoxClick(box) {
        if (box.diffState !== 'modified' || !box.attrDiffs?.length) return;

        this.#elements.modalContent.innerHTML = box.attrDiffs.map(d => {
            if (d.key === 'saved_attribute_attributes') {
                const oldA = d.old?.valueof ?? {}, newA = d.new?.valueof ?? {};
                return [...new Set([...Object.keys(oldA), ...Object.keys(newA)])]
                    .filter(k => JSON.stringify(oldA[k]) !== JSON.stringify(newA[k]))
                    .map(k => this.#formatAttrChange(`saved_attribute_attributes -> ${k}`, oldA[k], newA[k]))
                    .join('');
            }
            return this.#formatAttrChange(d.key, d.old, d.new);
        }).join('');

        if (this.#elements.modalContent.innerHTML) {
            this.#elements.modal.style.display = 'block';
        }
    }

    #formatAttrChange(key, oldV, newV) {
        return `
            <div class="attr-change">
                <div class="attr-name">${key}</div>
                <span class="attr-old">${JSON.stringify(oldV)}</span>
                <span class="attr-new">${JSON.stringify(newV)}</span>
            </div>
        `;
    }

    #handleBoxDblClick(box) {
        const mode = this.#state.state.viewMode;
        const pA = mode === 'before' ? box.patcher : (mode === 'diff' ? box.patcherA : null);
        const pB = mode === 'after' ? box.patcher : (mode === 'diff' ? box.patcherB : null);

        if (pA || pB) {
            this.#state.pushSubpatch(pA, pB);
        }
    }

    #renderMetadata(meta, diffs) {
        const content = diffs.length > 0
            ? diffs.map(d => `
                <div class="meta-change">
                    <div class="meta-key">${d.key}</div>
                    <pre class="meta-old">${JSON.stringify(d.old, null, 2)}</pre>
                    <pre class="meta-new">${JSON.stringify(d.new, null, 2)}</pre>
                </div>`).join('')
            : Object.entries(meta).map(([k, v]) => `
                <div class="meta-change">
                    <div class="meta-key">${k}</div>
                    <pre class="meta-new">${JSON.stringify(v, null, 2)}</pre>
                </div>`).join('');

        this.#elements.sidebarContent.innerHTML = content;
        const hasMeta = content.length > 0;
        this.#elements.btnMetadata.disabled = !hasMeta;
        if (!hasMeta) this.#elements.sidebar.classList.remove('open');
    }

    #applyZoom(level, pivot) {
        const {wrapper, patcher, btnZoomReset} = this.#elements;
        const rect = wrapper.getBoundingClientRect();
        const px = pivot ? pivot.x - rect.left : wrapper.clientWidth / 2;
        const py = pivot ? pivot.y - rect.top : wrapper.clientHeight / 2;

        // Get current scale from element to calculate ratio
        const matrix = new DOMMatrix(getComputedStyle(patcher).transform);
        const currentScale = matrix.a || 1;

        const ratio = level / currentScale;
        wrapper.scrollLeft = (px + wrapper.scrollLeft) * ratio - px;
        wrapper.scrollTop = (py + wrapper.scrollTop) * ratio - py;

        patcher.style.transform = `scale(${level})`;
        btnZoomReset.textContent = `${Math.round(level * 100)}%`;
    }
}

new PatcherApp();
