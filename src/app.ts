import "./components.js";
import { MaxPatcher } from "./components.js";
import { StateManager } from "./StateManager.js";

class PatcherApp {
  #state = new StateManager();
  #elements = {
    patcher: document.getElementById("patcher") as MaxPatcher,
    wrapper: document.getElementById("patcher-wrapper") as HTMLDivElement,
    fileInputs: document.getElementById("file-inputs") as HTMLDivElement,
    viewToggles: document.getElementById("view-toggles") as HTMLDivElement,
    presentationToggle: document.getElementById(
      "presentation-toggle",
    ) as HTMLInputElement,
    showRemovedToggle: document.getElementById(
      "show-removed-toggle",
    ) as HTMLInputElement,
    showRemovedContainer: document.getElementById(
      "show-removed-container",
    ) as HTMLDivElement,
    btnResetLayout: document.getElementById(
      "btn-reset-layout",
    ) as HTMLButtonElement,
    btnMetadata: document.getElementById("btn-metadata") as HTMLButtonElement,
    modal: document.getElementById("details-modal") as HTMLDivElement,
    modalContent: document.getElementById("diff-content") as HTMLDivElement,
    closeModal: document.querySelector(".close-button") as HTMLSpanElement,
    sidebar: document.getElementById("metadata-sidebar") as HTMLDivElement,
    sidebarContent: document.getElementById(
      "metadata-content",
    ) as HTMLDivElement,
    closeSidebar: document.getElementById(
      "btn-close-sidebar",
    ) as HTMLButtonElement,
    btnZoomIn: document.getElementById("btn-zoom-in") as HTMLButtonElement,
    btnZoomOut: document.getElementById("btn-zoom-out") as HTMLButtonElement,
    btnZoomReset: document.getElementById(
      "btn-zoom-reset",
    ) as HTMLButtonElement,
    controls: document.getElementById("controls") as HTMLDivElement,
    btnIgnoredDiffs: document.getElementById(
      "btn-ignored-diffs",
    ) as HTMLButtonElement,
    ignoredSidebar: document.getElementById(
      "ignored-sidebar",
    ) as HTMLDivElement,
    ignoredContent: document.getElementById(
      "ignored-content",
    ) as HTMLDivElement,
    closeIgnoredSidebar: document.getElementById(
      "btn-close-ignored-sidebar",
    ) as HTMLButtonElement,
    fileInputA: document.getElementById("fileInputA") as HTMLInputElement,
    fileInputB: document.getElementById("fileInputB") as HTMLInputElement,
  };

  #btnBack: HTMLButtonElement;
  #filenameDisplay: HTMLSpanElement;

  constructor() {
    this.#filenameDisplay = this.#createFilenameDisplay();
    this.#btnBack = this.#createBackButton();
    this.#setupEventListeners();
    this.#init();
  }

  async #init(): Promise<void> {
    await this.#loadInitialData();
  }

  #createFilenameDisplay(): HTMLSpanElement {
    const span = document.createElement("span");
    span.id = "filename-display";
    this.#elements.controls.prepend(span);
    return span;
  }

  #createBackButton(): HTMLButtonElement {
    const btn = document.createElement("button");
    Object.assign(btn, {
      id: "btn-back",
      textContent: "Back to Parent",
      hidden: true,
    });
    this.#elements.controls.appendChild(btn);
    return btn;
  }

  #setupEventListeners(): void {
    const {
      presentationToggle,
      showRemovedToggle,
      closeModal,
      modal,
      sidebar,
      closeSidebar,
      btnMetadata,
      btnResetLayout,
      btnZoomIn,
      btnZoomOut,
      btnZoomReset,
      wrapper,
      patcher,
      btnIgnoredDiffs,
      ignoredSidebar,
      closeIgnoredSidebar,
    } = this.#elements;

    presentationToggle.onchange = () =>
      this.#state.togglePresentation(presentationToggle.checked);

    showRemovedToggle.onchange = () =>
      this.#state.toggleShowRemovedPresentation(showRemovedToggle.checked);

    const closeM = () => (modal.style.display = "none");
    closeModal.onclick = closeM;
    window.onclick = (e: MouseEvent) => {
      if (e.target === modal) closeM();
    };

    btnMetadata.onclick = () => {
      sidebar.classList.toggle("open");
      ignoredSidebar.classList.remove("open");
    };
    closeSidebar.onclick = () => sidebar.classList.remove("open");

    btnIgnoredDiffs.onclick = () => {
      ignoredSidebar.classList.toggle("open");
      sidebar.classList.remove("open");
    };
    closeIgnoredSidebar.onclick = () => ignoredSidebar.classList.remove("open");

    document
      .querySelectorAll<HTMLInputElement>('input[name="view"]')
      .forEach((radio) => {
        radio.onchange = () => this.#state.setViewMode(radio.value);
      });

    const handleFile = (key: string) => async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const data = JSON.parse(await file.text());
      if (key === "dataA") this.#state.setFileA(data);
      else this.#state.setFileB(data);
    };

    this.#elements.fileInputA.onchange = handleFile("dataA");
    this.#elements.fileInputB.onchange = handleFile("dataB");

    btnResetLayout.onclick = () => {
      this.#state.resetLayout();
      closeM();
      sidebar.classList.remove("open");
      ignoredSidebar.classList.remove("open");
    };

    btnZoomIn.onclick = (e: MouseEvent) =>
      this.#state.setZoom(this.#state.state.zoomLevel * 1.1, {
        x: e.clientX,
        y: e.clientY,
      });
    btnZoomOut.onclick = (e: MouseEvent) =>
      this.#state.setZoom(this.#state.state.zoomLevel / 1.1, {
        x: e.clientX,
        y: e.clientY,
      });
    btnZoomReset.onclick = (e: MouseEvent) =>
      this.#state.setZoom(1.0, {
        x: e.clientX,
        y: e.clientY,
      });

    wrapper.onwheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1 / 1.05 : 1.05;
        this.#state.setZoom(this.#state.state.zoomLevel * factor, {
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    this.#btnBack.onclick = () => this.#state.popSubpatch();

    patcher.addEventListener("box-click", (e: Event) => {
      const { box, originalEvent } = (e as CustomEvent).detail;
      const isIndicator = originalEvent
        .composedPath()
        .some((el: HTMLElement) => el.classList?.contains("info-indicator"));
      if (isIndicator) this.#handleBoxClick(box);
    });
    patcher.addEventListener("box-dblclick", (e: Event) => {
      const { box, originalEvent } = (e as CustomEvent).detail;
      const isIndicator = originalEvent
        .composedPath()
        .some((el: HTMLElement) => el.classList?.contains("info-indicator"));
      if (!isIndicator) this.#handleBoxDblClick(box);
    });

    window.onpagehide = () => navigator.sendBeacon("/shutdown");

    this.#state.addEventListener("state-change", (e: Event) =>
      this.#onStateChange((e as CustomEvent).detail),
    );
  }

  async #loadInitialData(): Promise<void> {
    try {
      const res = await fetch("/diff-data");
      if (res.ok) {
        const data = await res.json();
        this.#elements.fileInputs.hidden = true;
        if (data.filename) {
          document.title = `Diff: ${data.filename}`;
          this.#filenameDisplay.textContent = data.filename;
        }
        this.#state.setInitialData(data.old, data.new);
      }
    } catch (e) {
      console.warn("Local server not found, falling back to file inputs.");
    }
  }

  #onStateChange({ type, state, pivot }: any): void {
    if (type === "data" || type === "navigation") {
      this.#elements.viewToggles.style.display = "block";
      this.#elements.btnMetadata.style.display = "inline-block";
      this.#elements.btnIgnoredDiffs.style.display = "inline-block";
      this.#btnBack.hidden = state.navStack.length === 0;
      this.#updateView(state);
    } else if (type === "view") {
      this.#updateView(state);
    } else if (type === "zoom") {
      this.#applyZoom(state.zoomLevel, pivot);
    } else if (type === "layout-reset") {
      this.#applyZoom(1.0);
      this.#elements.wrapper.scrollTo(0, 0);
    }
  }

  #updateView(state: any): void {
    const { patcher, showRemovedContainer } = this.#elements;
    const mode = state.viewMode;
    const isPres = state.isPresentation;

    patcher.toggleAttribute("presentation", isPres);
    patcher.toggleAttribute("diff", mode === "diff");
    patcher.showRemovedPresentation = state.showRemovedPresentation;
    showRemovedContainer.hidden = !isPres;

    const renderData = this.#state.currentRenderData;
    patcher.patchData = renderData;

    const { diffs, meta } = this.#state.currentMetadata;
    this.#renderMetadata(meta, diffs);
    this.#renderIgnoredDiffs(renderData.boxes);
  }

  #handleBoxClick(box: any): void {
    if (box.diffState !== "modified" || !box.attrDiffs?.length) return;

    this.#elements.modalContent.innerHTML = box.attrDiffs
      .map((d: any) => {
        if (d.key === "saved_attribute_attributes") {
          const oldA = d.old?.valueof ?? {},
            newA = d.new?.valueof ?? {};
          return [...new Set([...Object.keys(oldA), ...Object.keys(newA)])]
            .filter((k) => JSON.stringify(oldA[k]) !== JSON.stringify(newA[k]))
            .map((k) =>
              this.#formatAttrChange(
                `saved_attribute_attributes -> ${k}`,
                oldA[k],
                newA[k],
              ),
            )
            .join("");
        }
        return this.#formatAttrChange(d.key, d.old, d.new);
      })
      .join("");

    if (this.#elements.modalContent.innerHTML) {
      this.#elements.modal.style.display = "block";
    }
  }

  #formatAttrChange(key: string, oldV: any, newV: any): string {
    if (oldV === undefined) {
      return `
<div class="attr-change">
  <div class="attr-name">Added: ${key}</div>
  <span class="attr-new">${JSON.stringify(newV)}</span>
</div>
`;
    }
    if (newV === undefined) {
      return `
<div class="attr-change">
  <div class="attr-name">Removed: ${key}</div>
  <span class="attr-old">${JSON.stringify(oldV)}</span>
</div>
`;
    }
    return `
<div class="attr-change">
  <div class="attr-name">${key}</div>
  <span class="attr-old">${JSON.stringify(oldV)}</span>
  <span class="attr-new">${JSON.stringify(newV)}</span>
</div>
`;
  }

  #handleBoxDblClick(box: any): void {
    const mode = this.#state.state.viewMode;
    const pA =
      mode === "before" ? box.patcher : mode === "diff" ? box.patcherA : null;
    const pB =
      mode === "after" ? box.patcher : mode === "diff" ? box.patcherB : null;

    if (pA || pB) {
      this.#state.pushSubpatch(pA, pB);
    }
  }

  #renderMetadata(meta: any, diffs: any[]): void {
    const content =
      diffs.length > 0
        ? diffs
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
            .join("")
        : Object.entries(meta)
            .map(
              ([k, v]) => `
<div class="meta-change">
  <div class="meta-key">${k}</div>
  <pre class="meta-new">${JSON.stringify(v, null, 2)}</pre>
</div>
`,
            )
            .join("");

    this.#elements.sidebarContent.innerHTML = content;
    const hasMeta = content.length > 0;
    this.#elements.btnMetadata.disabled = !hasMeta;
    if (!hasMeta) this.#elements.sidebar.classList.remove("open");
  }

  #renderIgnoredDiffs(boxes: any[]): void {
    const ignoredDiffs: any[] = [];
    boxes.forEach((box) => {
      if (box.ignoredDiffs && box.ignoredDiffs.length > 0) {
        ignoredDiffs.push({ box, diffs: box.ignoredDiffs });
      }
    });

    const content = ignoredDiffs
      .map(({ box, diffs }) => {
        const diffsHtml = diffs
          .map(
            (d: any) => `
<div class="ignored-diff-item">
  <span class="ignored-key">${d.key}</span>:
  <span class="ignored-old">${JSON.stringify(d.old)}</span> ->
  <span class="ignored-new">${JSON.stringify(d.new)}</span>
</div>
`,
          )
          .join("");

        return `
<div class="ignored-box-group" data-box-id="${box.id}">
  <div class="ignored-box-header">Box ${box.id} (${box.maxclass})</div>
  ${diffsHtml}
</div>
`;
      })
      .join("");

    this.#elements.ignoredContent.innerHTML = content;
    const hasIgnored = content.length > 0;
    this.#elements.btnIgnoredDiffs.disabled = !hasIgnored;
    if (!hasIgnored) this.#elements.ignoredSidebar.classList.remove("open");

    this.#elements.ignoredContent
      .querySelectorAll<HTMLDivElement>(".ignored-box-group")
      .forEach((el) => {
        el.onmouseenter = () => {
          const boxId = el.dataset.boxId;
          this.#elements.patcher.highlightBox(boxId);
        };
        el.onmouseleave = () => {
          this.#elements.patcher.clearHighlight();
        };
      });
  }

  #applyZoom(level: number, pivot?: { x: number; y: number }): void {
    const { wrapper, patcher, btnZoomReset } = this.#elements;
    const rect = wrapper.getBoundingClientRect();
    const px = pivot ? pivot.x - rect.left : wrapper.clientWidth / 2;
    const py = pivot ? pivot.y - rect.top : wrapper.clientHeight / 2;

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
