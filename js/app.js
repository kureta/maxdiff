import './components.js';
import { DiffEngine } from './DiffEngine.js';

/**
 * Main application controller for the Max Patch Diff Tool.
 */
class PatcherApp {
    #state = {
        dataA: null,
        dataB: null,
        currentDiffData: null,
        zoomLevel: 1.0,
        navStack: []
    };

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

        presentationToggle.onchange = () => this.#updateView();
        
        const closeM = () => modal.style.display = 'none';
        closeModal.onclick = closeM;
        window.onclick = (e) => { if (e.target === modal) closeM(); };

        btnMetadata.onclick = () => sidebar.classList.toggle('open');
        closeSidebar.onclick = () => sidebar.classList.remove('open');

        document.querySelectorAll('input[name="view"]').forEach(radio => {
            radio.onchange = () => this.#updateView();
        });

        const handleFile = (key) => async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            this.#state[key] = JSON.parse(await file.text());
            this.#onDataChanged();
        };

        document.getElementById('fileInputA').onchange = handleFile('dataA');
        document.getElementById('fileInputB').onchange = handleFile('dataB');

        btnResetLayout.onclick = () => {
            this.#setZoom(1.0);
            wrapper.scrollTo(0, 0);
            closeM();
            sidebar.classList.remove('open');
            this.#onDataChanged();
        };

        btnZoomIn.onclick = () => this.#setZoom(this.#state.zoomLevel * 1.1);
        btnZoomOut.onclick = () => this.#setZoom(this.#state.zoomLevel / 1.1);
        btnZoomReset.onclick = () => this.#setZoom(1.0);

        wrapper.onwheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const factor = e.deltaY > 0 ? 1 / 1.05 : 1.05;
                this.#setZoom(this.#state.zoomLevel * factor, { x: e.clientX, y: e.clientY });
            }
        };

        this.#btnBack.onclick = () => this.#navigateBack();

        patcher.addEventListener('box-click', (e) => {
            const { box, originalEvent } = e.detail;
            const isIndicator = originalEvent.composedPath().some(el => el.classList?.contains('info-indicator'));
            if (isIndicator) this.#handleBoxClick(box);
        });
        patcher.addEventListener('box-dblclick', (e) => {
            const { box, originalEvent } = e.detail;
            const isIndicator = originalEvent.composedPath().some(el => el.classList?.contains('info-indicator'));
            if (!isIndicator) this.#handleBoxDblClick(box);
        });

        window.onpagehide = () => navigator.sendBeacon('/shutdown');
    }

    async #loadInitialData() {
        try {
            const res = await fetch('/diff-data');
            if (res.ok) {
                const data = await res.json();
                this.#elements.fileInputs.hidden = true;
                if (data.filename) document.title = `Diff: ${data.filename}`;
                this.#state.dataA = data.old;
                this.#state.dataB = data.new;
                this.#onDataChanged();
            }
        } catch (e) {
            console.warn('Local server not found, falling back to file inputs.');
        }
    }

    #onDataChanged() {
        if (!this.#state.dataA && !this.#state.dataB) return;
        this.#state.currentDiffData = DiffEngine.compare(this.#state.dataA, this.#state.dataB);
        this.#elements.viewToggles.style.display = 'block';
        this.#elements.btnMetadata.style.display = 'inline-block';
        this.#updateView();
    }

    #updateView() {
        const mode = document.querySelector('input[name="view"]:checked')?.value ?? 'diff';
        const isPres = this.#elements.presentationToggle.checked;
        const patcher = this.#elements.patcher;

        patcher.toggleAttribute('presentation', isPres);
        patcher.toggleAttribute('diff', mode === 'diff');

        let meta = {};
        let metaDiffs = [];

        if (mode === 'before' && this.#state.dataA) {
            patcher.patchData = DiffEngine.normalize(this.#state.dataA);
            meta = DiffEngine.getMetadata(this.#state.dataA);
        } else if (mode === 'after' && this.#state.dataB) {
            patcher.patchData = DiffEngine.normalize(this.#state.dataB);
            meta = DiffEngine.getMetadata(this.#state.dataB);
        } else if (mode === 'diff' && this.#state.currentDiffData) {
            patcher.patchData = this.#state.currentDiffData;
            metaDiffs = DiffEngine.compareMetadata(this.#state.dataA, this.#state.dataB);
        }

        this.#renderMetadata(meta, metaDiffs);
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
        const mode = document.querySelector('input[name="view"]:checked')?.value ?? 'diff';
        const pA = mode === 'before' ? box.patcher : (mode === 'diff' ? box.patcherA : null);
        const pB = mode === 'after' ? box.patcher : (mode === 'diff' ? box.patcherB : null);
        
        if (pA || pB) {
            this.#navigateToSubpatch(pA, pB);
        }
    }

    #navigateToSubpatch(pA, pB) {
        this.#state.navStack.push({ dataA: this.#state.dataA, dataB: this.#state.dataB });
        this.#btnBack.hidden = false;
        this.#state.dataA = pA ? { patcher: pA } : null;
        this.#state.dataB = pB ? { patcher: pB } : null;
        this.#onDataChanged();
    }

    #navigateBack() {
        const prevState = this.#state.navStack.pop();
        this.#btnBack.hidden = this.#state.navStack.length === 0;
        Object.assign(this.#state, prevState);
        this.#onDataChanged();
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

    #setZoom(level, pivot) {
        level = Math.max(0.2, Math.min(level, 3.0));
        if (level === this.#state.zoomLevel) return;

        const { wrapper, patcher, btnZoomReset } = this.#elements;
        const rect = wrapper.getBoundingClientRect();
        const px = pivot ? pivot.x - rect.left : wrapper.clientWidth / 2;
        const py = pivot ? pivot.y - rect.top : wrapper.clientHeight / 2;

        const ratio = level / this.#state.zoomLevel;
        wrapper.scrollLeft = (px + wrapper.scrollLeft) * ratio - px;
        wrapper.scrollTop = (py + wrapper.scrollTop) * ratio - py;

        this.#state.zoomLevel = level;
        patcher.style.transform = `scale(${level})`;
        btnZoomReset.textContent = `${Math.round(level * 100)}%`;
    }
}

new PatcherApp();
