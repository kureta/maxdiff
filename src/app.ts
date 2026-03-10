import "./components.js";
import { MaxPatcher, BoxViewModel } from "./components.js";
import { StateManager, ViewMode, StateChangeEvent } from "./StateManager.js";
import { MetadataDiff } from "./DiffPresenter.js";
import type { MaxPatch } from "./DiffEngine.js";

// ─── HTML Formatting (pure functions) ────────────────────────────────────────

function renderAttrChange(key: string, oldV: unknown, newV: unknown): string {
  const [label, oldHtml, newHtml] = [
    oldV === undefined
      ? `Added: ${key}`
      : newV === undefined
        ? `Removed: ${key}`
        : key,
    oldV !== undefined
      ? `<span class="attr-old">${JSON.stringify(oldV)}</span>`
      : "",
    newV !== undefined
      ? `<span class="attr-new">${JSON.stringify(newV)}</span>`
      : "",
  ];
  return `<div class="attr-change">
  <div class="attr-name">${label}</div>
  ${oldHtml}${newHtml}
</div>`;
}

function renderMetadataEntry(
  key: string,
  oldV: unknown,
  newV: unknown,
): string {
  const label =
    oldV === undefined
      ? `Added: ${key}`
      : newV === undefined
        ? `Removed: ${key}`
        : key;
  const oldHtml =
    oldV !== undefined
      ? `<pre class="meta-old">${JSON.stringify(oldV, null, 2)}</pre>`
      : "";
  const newHtml =
    newV !== undefined
      ? `<pre class="meta-new">${JSON.stringify(newV, null, 2)}</pre>`
      : "";
  return `<div class="meta-change">
  <div class="meta-key">${label}</div>
  ${oldHtml}${newHtml}
</div>`;
}

function renderMetadataPanel(
  values: Readonly<Record<string, unknown>>,
  diffs: readonly MetadataDiff[],
): string {
  if (diffs.length > 0)
    return diffs.map((d) => renderMetadataEntry(d.key, d.old, d.new)).join("");

  return Object.entries(values)
    .map(([k, v]) => renderMetadataEntry(k, undefined, v))
    .join("");
}

function renderBoxAttrDiffs(attrDiffs: BoxViewModel["attrDiffs"]): string {
  return (attrDiffs ?? [])
    .map((d) => {
      if (d.key === "saved_attribute_attributes") {
        const oldA =
          ((d.old as Record<string, unknown> | undefined)?.[
            "valueof"
          ] as Record<string, unknown>) ?? {};
        const newA =
          ((d.new as Record<string, unknown> | undefined)?.[
            "valueof"
          ] as Record<string, unknown>) ?? {};
        return [...new Set([...Object.keys(oldA), ...Object.keys(newA)])]
          .filter((k) => JSON.stringify(oldA[k]) !== JSON.stringify(newA[k]))
          .map((k) =>
            renderAttrChange(
              `saved_attribute_attributes → ${k}`,
              oldA[k],
              newA[k],
            ),
          )
          .join("");
      }
      return renderAttrChange(d.key, d.old, d.new);
    })
    .join("");
}

// ─── DOM Helpers ─────────────────────────────────────────────────────────────

function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

// ─── App ─────────────────────────────────────────────────────────────────────

class PatcherApp {
  readonly #state = new StateManager();

  readonly #patcher = el<MaxPatcher>("patcher");
  readonly #wrapper = el<HTMLDivElement>("patcher-wrapper");
  readonly #fileInputs = el<HTMLDivElement>("file-inputs");
  readonly #viewToggles = el<HTMLDivElement>("view-toggles");
  readonly #presToggle = el<HTMLInputElement>("presentation-toggle");
  readonly #showRemToggle = el<HTMLInputElement>("show-removed-toggle");
  readonly #showRemCont = el<HTMLDivElement>("show-removed-container");
  readonly #btnReset = el<HTMLButtonElement>("btn-reset-layout");
  readonly #btnMeta = el<HTMLButtonElement>("btn-metadata");
  readonly #modal = el<HTMLDivElement>("details-modal");
  readonly #modalContent = el<HTMLDivElement>("diff-content");
  readonly #sidebar = el<HTMLDivElement>("metadata-sidebar");
  readonly #sidebarCont = el<HTMLDivElement>("metadata-content");
  readonly #btnZoomIn = el<HTMLButtonElement>("btn-zoom-in");
  readonly #btnZoomOut = el<HTMLButtonElement>("btn-zoom-out");
  readonly #btnZoomReset = el<HTMLButtonElement>("btn-zoom-reset");
  readonly #fileInputA = el<HTMLInputElement>("fileInputA");
  readonly #fileInputB = el<HTMLInputElement>("fileInputB");

  readonly #btnBack = Object.assign(document.createElement("button"), {
    textContent: "Back to Parent",
    hidden: true,
  });
  readonly #filenameDisplay = Object.assign(document.createElement("span"), {
    id: "filename-display",
  });

  constructor() {
    el<HTMLDivElement>("controls").prepend(this.#filenameDisplay);
    el<HTMLDivElement>("controls").appendChild(this.#btnBack);
    this.#wireEvents();
    this.#loadInitialData();
  }

  // ── Initialisation ──────────────────────────────────────────────────────────

  async #loadInitialData(): Promise<void> {
    try {
      const res = await fetch("/diff-data");
      if (!res.ok) return;
      const data = (await res.json()) as {
        old: unknown;
        new: unknown;
        filename?: string;
      };
      this.#fileInputs.hidden = true;
      if (data.filename) {
        document.title = `Diff: ${data.filename}`;
        this.#filenameDisplay.textContent = data.filename;
      }
      this.#state.setInitialData(data.old as never, data.new as never);
    } catch {
      console.info("Local server not available; using file inputs.");
    }
  }

  // ── Event Wiring ────────────────────────────────────────────────────────────

  #wireEvents(): void {
    // Toggles
    this.#presToggle.onchange = () =>
      this.#state.togglePresentation(this.#presToggle.checked);
    this.#showRemToggle.onchange = () =>
      this.#state.toggleShowRemovedPresentation(this.#showRemToggle.checked);

    // View mode radios
    document
      .querySelectorAll<HTMLInputElement>('input[name="view"]')
      .forEach((r) => {
        r.onchange = () => this.#state.setViewMode(r.value as ViewMode);
      });

    // File inputs
    this.#fileInputA.onchange = (e) =>
      this.#loadFile(e, (data) => this.#state.setFileA(data));
    this.#fileInputB.onchange = (e) =>
      this.#loadFile(e, (data) => this.#state.setFileB(data));

    // Buttons
    this.#btnReset.onclick = () => {
      this.#state.resetLayout();
      this.#closeModal();
      this.#sidebar.classList.remove("open");
    };
    this.#btnMeta.onclick = () => this.#sidebar.classList.toggle("open");
    this.#btnBack.onclick = () => this.#state.popSubpatch();

    el<HTMLButtonElement>("btn-close-modal").onclick = () => this.#closeModal();
    el<HTMLButtonElement>("btn-close-sidebar").onclick = () =>
      this.#sidebar.classList.remove("open");
    window.onclick = (e) => {
      if (e.target === this.#modal) this.#closeModal();
    };

    // Zoom
    this.#btnZoomIn.onclick = (e) => this.#zoom(this.#state.zoomLevel * 1.1, e);
    this.#btnZoomOut.onclick = (e) =>
      this.#zoom(this.#state.zoomLevel / 1.1, e);
    this.#btnZoomReset.onclick = (e) => this.#zoom(1.0, e);
    this.#wrapper.onwheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      this.#zoom(this.#state.zoomLevel * (e.deltaY > 0 ? 1 / 1.05 : 1.05), e);
    };

    // Patcher interactions
    this.#patcher.addEventListener("box-click", (e) =>
      this.#onBoxClick(e as CustomEvent),
    );
    this.#patcher.addEventListener("box-dblclick", (e) =>
      this.#onBoxDblClick(e as CustomEvent),
    );

    // Shutdown beacon
    window.onpagehide = () => navigator.sendBeacon("/shutdown");

    // State changes
    this.#state.addEventListener("state-change", (e) =>
      this.#onStateChange((e as CustomEvent<StateChangeEvent>).detail),
    );
  }

  // ── State Change Handler ────────────────────────────────────────────────────

  #onStateChange({ type, pivot }: StateChangeEvent): void {
    switch (type) {
      case "data":
      case "navigation":
        this.#viewToggles.style.display = "block";
        this.#btnMeta.style.display = "inline-block";
        this.#btnBack.hidden = !this.#state.hasParent;
        this.#syncView();
        break;
      case "view":
        this.#syncView();
        break;
      case "zoom":
        this.#applyZoom(pivot);
        break;
      case "layout-reset":
        this.#syncView();
        this.#applyZoom();
        this.#wrapper.scrollTo(0, 0);
        break;
    }
  }

  #syncView(): void {
    this.#patcher.toggleAttribute("presentation", this.#state.isPresentation);
    this.#patcher.toggleAttribute("diff", this.#state.viewMode === "diff");
    this.#patcher.showRemovedPresentation = this.#state.showRemovedPresentation;
    this.#showRemCont.hidden = !this.#state.isPresentation;
    this.#patcher.patchData = this.#state.renderModel;

    const { diffs, values } = this.#state.metadata;
    const html = renderMetadataPanel(values, diffs);
    this.#sidebarCont.innerHTML = html;
    this.#btnMeta.disabled = !html;
    if (!html) this.#sidebar.classList.remove("open");
  }

  // ── Box Interaction ─────────────────────────────────────────────────────────

  #onBoxClick({
    detail: { box, originalEvent },
  }: CustomEvent<{ box: BoxViewModel; originalEvent: MouseEvent }>): void {
    const clickedInfo = (originalEvent.composedPath() as HTMLElement[]).some(
      (el) => el.classList?.contains("info-indicator"),
    );
    if (clickedInfo) this.#openBoxModal(box);
  }

  #onBoxDblClick({
    detail: { box, originalEvent },
  }: CustomEvent<{ box: BoxViewModel; originalEvent: MouseEvent }>): void {
    const clickedInfo = (originalEvent.composedPath() as HTMLElement[]).some(
      (el) => el.classList?.contains("info-indicator"),
    );
    if (!clickedInfo) this.#state.enterSubpatch(box.id);
  }

  #openBoxModal(box: BoxViewModel): void {
    if (box.diffState !== "modified" || !box.attrDiffs?.length) return;
    const html = renderBoxAttrDiffs(box.attrDiffs);
    if (!html) return;
    this.#modalContent.innerHTML = html;
    this.#modal.style.display = "block";
  }

  #closeModal(): void {
    this.#modal.style.display = "none";
  }

  // ── Zoom ────────────────────────────────────────────────────────────────────

  #zoom(level: number, e?: MouseEvent): void {
    this.#state.setZoom(level, e ? { x: e.clientX, y: e.clientY } : undefined);
  }

  #applyZoom(pivot?: { x: number; y: number }): void {
    const { wrapper: w, patcher: p } = {
      wrapper: this.#wrapper,
      patcher: this.#patcher,
    };
    const rect = w.getBoundingClientRect();
    const px = pivot ? pivot.x - rect.left : w.clientWidth / 2;
    const py = pivot ? pivot.y - rect.top : w.clientHeight / 2;
    const current = new DOMMatrix(getComputedStyle(p).transform).a || 1;
    const ratio = this.#state.zoomLevel / current;

    w.scrollLeft = (px + w.scrollLeft) * ratio - px;
    w.scrollTop = (py + w.scrollTop) * ratio - py;

    p.style.transform = `scale(${this.#state.zoomLevel})`;
    this.#btnZoomReset.textContent = `${Math.round(this.#state.zoomLevel * 100)}%`;
  }

  // ── File Loading ─────────────────────────────────────────────────────────────

  async #loadFile(e: Event, cb: (data: MaxPatch) => void): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    cb(JSON.parse(await file.text()) as MaxPatch);
  }
}

new PatcherApp();
