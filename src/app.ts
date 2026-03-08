import "./components.js";
import { MaxPatcher, BoxViewModel } from "./components.js";
import { StateManager, ViewMode } from "./StateManager.js";

class UIFormatter {
  static renderAttrDiff(key: string, oldV: unknown, newV: unknown): string {
    if (oldV === undefined)
      return `
<div class="attr-change">
  <div class="attr-name">Added: ${key}</div>
  <span class="attr-new">${JSON.stringify(newV)}</span>
</div>
`;
    if (newV === undefined)
      return `
<div class="attr-change">
  <div class="attr-name">Removed: ${key}</div>
  <span class="attr-old">${JSON.stringify(oldV)}</span>
</div>
`;
    return `
<div class="attr-change">
  <div class="attr-name">${key}</div>
  <span class="attr-old">${JSON.stringify(oldV)}</span
  ><span class="attr-new">${JSON.stringify(newV)}</span>
</div>
`;
  }

  static renderMetadata(
    meta: Record<string, unknown>,
    diffs: { key: string; old?: unknown; new?: unknown }[],
  ): string {
    if (diffs.length === 0) {
      return Object.entries(meta)
        .map(
          ([k, v]) =>
            `
            <div class="meta-change">
              <div class="meta-key">${k}</div>
              <pre class="meta-new">${JSON.stringify(v, null, 2)}</pre>
            </div>
            `,
        )
        .join("");
    }

    return diffs
      .map((d) => {
        if (d.old === undefined) {
          return `
<div class="meta-change">
  <div class="meta-key">Added: ${d.key}</div>
  <pre class="meta-new">${JSON.stringify(d.new, null, 2)}</pre>
</div>
`;
        }
        if (d.new === undefined) {
          return `
<div class="meta-change">
  <div class="meta-key">Removed: ${d.key}</div>
  <pre class="meta-old">${JSON.stringify(d.old, null, 2)}</pre>
</div>
`;
        }
        return `
<div class="meta-change">
  <div class="meta-key">${d.key}</div>
  <pre class="meta-old">${JSON.stringify(d.old, null, 2)}</pre>
  <pre class="meta-new">${JSON.stringify(d.new, null, 2)}</pre>
</div>
`;
      })
      .join("");
  }
}

class PatcherApp {
  #state = new StateManager();

  // Element caching
  #els = {
    patcher: document.getElementById("patcher") as MaxPatcher,
    wrapper: document.getElementById("patcher-wrapper") as HTMLDivElement,
    fileInputs: document.getElementById("file-inputs") as HTMLDivElement,
    viewToggles: document.getElementById("view-toggles") as HTMLDivElement,
    presToggle: document.getElementById(
      "presentation-toggle",
    ) as HTMLInputElement,
    showRemToggle: document.getElementById(
      "show-removed-toggle",
    ) as HTMLInputElement,
    showRemContainer: document.getElementById(
      "show-removed-container",
    ) as HTMLDivElement,
    btnReset: document.getElementById("btn-reset-layout") as HTMLButtonElement,
    btnMeta: document.getElementById("btn-metadata") as HTMLButtonElement,
    modal: document.getElementById("details-modal") as HTMLDivElement,
    modalContent: document.getElementById("diff-content") as HTMLDivElement,
    btnCloseModal: document.getElementById(
      "btn-close-modal",
    ) as HTMLSpanElement,
    sidebar: document.getElementById("metadata-sidebar") as HTMLDivElement,
    sidebarContent: document.getElementById(
      "metadata-content",
    ) as HTMLDivElement,
    btnCloseSidebar: document.getElementById(
      "btn-close-sidebar",
    ) as HTMLButtonElement,
    btnZoomIn: document.getElementById("btn-zoom-in") as HTMLButtonElement,
    btnZoomOut: document.getElementById("btn-zoom-out") as HTMLButtonElement,
    btnZoomReset: document.getElementById(
      "btn-zoom-reset",
    ) as HTMLButtonElement,
    controls: document.getElementById("controls") as HTMLDivElement,
    fileInputA: document.getElementById("fileInputA") as HTMLInputElement,
    fileInputB: document.getElementById("fileInputB") as HTMLInputElement,
  };

  #btnBack = document.createElement("button");
  #filenameDisplay = document.createElement("span");

  constructor() {
    this.#btnBack.textContent = "Back to Parent";
    this.#btnBack.hidden = true;
    this.#filenameDisplay.id = "filename-display";

    this.#els.controls.prepend(this.#filenameDisplay);
    this.#els.controls.appendChild(this.#btnBack);

    this.#setupEvents();
    this.#loadInitialData();
  }

  async #loadInitialData(): Promise<void> {
    try {
      const res = await fetch("/diff-data");
      if (!res.ok) return;
      const data = await res.json();
      this.#els.fileInputs.hidden = true;
      if (data.filename) {
        document.title = `Diff: ${data.filename}`;
        this.#filenameDisplay.textContent = data.filename;
      }
      this.#state.setInitialData(data.old, data.new);
    } catch {
      console.warn("Local server not found, falling back to file inputs.");
    }
  }

  #setupEvents(): void {
    const { els, state } = { els: this.#els, state: this.#state };

    els.presToggle.onchange = () =>
      state.togglePresentation(els.presToggle.checked);
    els.showRemToggle.onchange = () =>
      state.toggleShowRemovedPresentation(els.showRemToggle.checked);

    const closeModal = () => (els.modal.style.display = "none");
    els.btnCloseModal.onclick = closeModal;
    window.onclick = (e) => {
      if (e.target === els.modal) closeModal();
    };

    els.btnMeta.onclick = () => els.sidebar.classList.toggle("open");
    els.btnCloseSidebar.onclick = () => els.sidebar.classList.remove("open");

    document
      .querySelectorAll<HTMLInputElement>('input[name="view"]')
      .forEach((radio) => {
        radio.onchange = () => state.setViewMode(radio.value as ViewMode);
      });

    const handleFile = (isOld: boolean) => async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const data = JSON.parse(await file.text());
      isOld ? state.setFileA(data) : state.setFileB(data);
    };

    els.fileInputA.onchange = handleFile(true);
    els.fileInputB.onchange = handleFile(false);

    els.btnReset.onclick = () => {
      state.resetLayout();
      closeModal();
      els.sidebar.classList.remove("open");
    };

    const handleZoom = (factor: number, e?: MouseEvent) =>
      state.setZoom(
        factor === 1.0 ? 1.0 : state.zoomLevel * factor,
        e ? { x: e.clientX, y: e.clientY } : undefined,
      );

    els.btnZoomIn.onclick = (e) => handleZoom(1.1, e);
    els.btnZoomOut.onclick = (e) => handleZoom(1 / 1.1, e);
    els.btnZoomReset.onclick = (e) => handleZoom(1.0, e);

    els.wrapper.onwheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? 1 / 1.05 : 1.05, e);
    };

    this.#btnBack.onclick = () => state.popSubpatch();

    els.patcher.addEventListener("box-click", (e: Event) => {
      const { box, originalEvent } = (e as CustomEvent).detail;
      if (
        originalEvent
          .composedPath()
          .some((el: HTMLElement) => el.classList?.contains("info-indicator"))
      ) {
        this.#openBoxModal(box);
      }
    });

    els.patcher.addEventListener("box-dblclick", (e: Event) => {
      const { box, originalEvent } = (e as CustomEvent).detail;
      if (
        !originalEvent
          .composedPath()
          .some((el: HTMLElement) => el.classList?.contains("info-indicator"))
      ) {
        const pA =
          state.viewMode === "before"
            ? box.patcher
            : state.viewMode === "diff"
              ? box.patcherA
              : null;
        const pB =
          state.viewMode === "after"
            ? box.patcher
            : state.viewMode === "diff"
              ? box.patcherB
              : null;
        if (pA || pB) state.pushSubpatch(pA, pB);
      }
    });

    window.onpagehide = () => navigator.sendBeacon("/shutdown");
    state.addEventListener("state-change", (e) =>
      this.#onStateChange((e as CustomEvent).detail),
    );
  }

  #onStateChange({
    type,
    pivot,
  }: {
    type: string;
    pivot?: { x: number; y: number };
  }): void {
    if (type === "data" || type === "navigation") {
      this.#els.viewToggles.style.display = "block";
      this.#els.btnMeta.style.display = "inline-block";
      this.#btnBack.hidden = !this.#state.hasParent;
      this.#syncView();
    } else if (type === "view") {
      this.#syncView();
    } else if (type === "zoom") {
      this.#applyZoom(pivot);
    } else if (type === "layout-reset") {
      this.#applyZoom();
      this.#els.wrapper.scrollTo(0, 0);
    }
  }

  #syncView(): void {
    const { patcher, showRemContainer, sidebarContent, btnMeta, sidebar } =
      this.#els;

    patcher.toggleAttribute("presentation", this.#state.isPresentation);
    patcher.toggleAttribute("diff", this.#state.viewMode === "diff");
    patcher.showRemovedPresentation = this.#state.showRemovedPresentation;
    showRemContainer.hidden = !this.#state.isPresentation;

    patcher.patchData = this.#state.currentRenderData;

    const { diffs, meta } = this.#state.currentMetadata;
    const metaHtml = UIFormatter.renderMetadata(meta, diffs);
    sidebarContent.innerHTML = metaHtml;

    btnMeta.disabled = !metaHtml;
    if (!metaHtml) sidebar.classList.remove("open");
  }

  #openBoxModal(box: BoxViewModel): void {
    if (box.diffState !== "modified" || !box.attrDiffs?.length) return;

    this.#els.modalContent.innerHTML = box.attrDiffs
      .map((d) => {
        if (d.key === "saved_attribute_attributes") {
          const oldA = (d.old as any)?.valueof ?? {};
          const newA = (d.new as any)?.valueof ?? {};
          return [...new Set([...Object.keys(oldA), ...Object.keys(newA)])]
            .filter((k) => JSON.stringify(oldA[k]) !== JSON.stringify(newA[k]))
            .map((k) =>
              UIFormatter.renderAttrDiff(
                `saved_attribute_attributes -> ${k}`,
                oldA[k],
                newA[k],
              ),
            )
            .join("");
        }
        return UIFormatter.renderAttrDiff(d.key, d.old, d.new);
      })
      .join("");

    if (this.#els.modalContent.innerHTML)
      this.#els.modal.style.display = "block";
  }

  #applyZoom(pivot?: { x: number; y: number }): void {
    const { wrapper, patcher, btnZoomReset } = this.#els;
    const rect = wrapper.getBoundingClientRect();
    const px = pivot ? pivot.x - rect.left : wrapper.clientWidth / 2;
    const py = pivot ? pivot.y - rect.top : wrapper.clientHeight / 2;

    const currentScale =
      new DOMMatrix(getComputedStyle(patcher).transform).a || 1;
    const ratio = this.#state.zoomLevel / currentScale;

    wrapper.scrollLeft = (px + wrapper.scrollLeft) * ratio - px;
    wrapper.scrollTop = (py + wrapper.scrollTop) * ratio - py;

    patcher.style.transform = `scale(${this.#state.zoomLevel})`;
    btnZoomReset.textContent = `${Math.round(this.#state.zoomLevel * 100)}%`;
  }
}

new PatcherApp();
