import "./components.js";
import { StateManager } from "./StateManager.js";

// ─── HTML Formatting (pure functions) ────────────────────────────────────────

function diffLabel(key, oldV, newV) {
  return oldV === undefined
    ? `Added: ${key}`
    : newV === undefined
      ? `Removed: ${key}`
      : key;
}

function renderAttrChange(key, oldV, newV) {
  const oldHtml =
    oldV !== undefined
      ? `<span class="attr-old">${JSON.stringify(oldV)}</span>`
      : "";
  const newHtml =
    newV !== undefined
      ? `<span class="attr-new">${JSON.stringify(newV)}</span>`
      : "";
  return `<div class="attr-change">
  <div class="attr-name">${diffLabel(key, oldV, newV)}</div>
  ${oldHtml}${newHtml}
</div>`;
}

function renderMetadataEntry(key, oldV, newV) {
  const oldHtml =
    oldV !== undefined
      ? `<pre class="meta-old">${JSON.stringify(oldV, null, 2)}</pre>`
      : "";
  const newHtml =
    newV !== undefined
      ? `<pre class="meta-new">${JSON.stringify(newV, null, 2)}</pre>`
      : "";
  return `<div class="meta-change">
  <div class="meta-key">${diffLabel(key, oldV, newV)}</div>
  ${oldHtml}${newHtml}
</div>`;
}

function renderMetadataPanel(values, diffs) {
  if (diffs.length > 0)
    return diffs.map((d) => renderMetadataEntry(d.key, d.old, d.new)).join("");

  return Object.entries(values)
    .map(([k, v]) => renderMetadataEntry(k, undefined, v))
    .join("");
}

function renderBoxAttrDiffs(attrDiffs) {
  return (attrDiffs ?? [])
    .map((d) => {
      if (d.key === "saved_attribute_attributes") {
        const oldA = d.old?.["valueof"] ?? {};
        const newA = d.new?.["valueof"] ?? {};
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

function el(id) {
  return document.getElementById(id);
}

// ─── App ─────────────────────────────────────────────────────────────────────

class PatcherApp {
  #state = new StateManager();

  #commits = [];
  #beforeIdx = 0;
  #afterIdx = 1;

  #patcher = el("patcher");
  #wrapper = el("patcher-wrapper");
  #fileInputs = el("file-inputs");
  #gitControls = el("btn-git-history");
  #gitPanel = el("git-panel");
  #selectBefore = el("select-before");
  #selectAfter = el("select-after");
  #btnGitPrev = el("btn-git-prev");
  #btnGitNext = el("btn-git-next");
  #btnBeforePrev = el("btn-before-prev");
  #btnBeforeNext = el("btn-before-next");
  #btnAfterPrev = el("btn-after-prev");
  #btnAfterNext = el("btn-after-next");
  #viewToggles = el("view-toggles");
  #presToggle = el("presentation-toggle");
  #showRemToggle = el("show-removed-toggle");
  #showRemCont = el("show-removed-container");
  #btnReset = el("btn-reset-layout");
  #btnMeta = el("btn-metadata");
  #btnBack = el("btn-back");
  #filenameDisplay = el("filename-display");
  #modal = el("details-modal");
  #modalContent = el("diff-content");
  #sidebar = el("metadata-sidebar");
  #sidebarCont = el("metadata-content");
  #btnZoomIn = el("btn-zoom-in");
  #btnZoomOut = el("btn-zoom-out");
  #btnZoomReset = el("btn-zoom-reset");
  #fileInputA = el("fileInputA");
  #fileInputB = el("fileInputB");

  constructor() {
    this.#wireEvents();
    this.#loadInitialData();
  }

  // ── Initialisation ──────────────────────────────────────────────────────────

  async #loadInitialData() {
    // 1. Try git history mode
    try {
      const res = await fetch("/commits");
      if (res.ok) {
        const commits = await res.json();
        if (commits.length >= 2) {
          this.#enterGitMode(commits);
          return;
        }
      }
    } catch {}

    // 2. Try static diff-data
    try {
      const res = await fetch("/diff-data");
      if (!res.ok) return;
      const data = await res.json();
      this.#fileInputs.hidden = true;
      if (data.filename) {
        document.title = `Diff: ${data.filename}`;
        this.#filenameDisplay.textContent = data.filename;
      }
      this.#state.setInitialData(data.old, data.new);
    } catch {
      console.info("Local server not available; using file inputs.");
    }
  }

  // ── Git Mode ─────────────────────────────────────────────────────────────────

  #enterGitMode(commits) {
    this.#commits = commits;
    this.#beforeIdx = commits.length - 2;
    this.#afterIdx = commits.length - 1;
    this.#fileInputs.hidden = true;
    this.#gitControls.hidden = false;
    // this.#gitPanel.classList.add("open");
    // this.#gitControls.classList.add("active");
    this.#populateCommitSelects();
    this.#syncGitUI();
    this.#fetchGitDiff();
  }

  #populateCommitSelects() {
    const options = this.#commits
      .map(
        (c, i) => `<option value="${i}">[${c.short_sha}] ${c.message}</option>`,
      )
      .join("");
    this.#selectBefore.innerHTML = options;
    this.#selectAfter.innerHTML = options;
  }

  #syncGitUI() {
    this.#selectBefore.value = this.#beforeIdx;
    this.#selectAfter.value = this.#afterIdx;
    this.#btnGitPrev.disabled = this.#beforeIdx <= 0;
    this.#btnGitNext.disabled = this.#afterIdx >= this.#commits.length - 1;
    this.#btnBeforePrev.disabled = this.#beforeIdx <= 0;
    this.#btnBeforeNext.disabled = this.#beforeIdx >= this.#afterIdx - 1;
    this.#btnAfterPrev.disabled = this.#afterIdx <= this.#beforeIdx + 1;
    this.#btnAfterNext.disabled = this.#afterIdx >= this.#commits.length - 1;
  }

  #stepBoth(delta) {
    const nb = this.#beforeIdx + delta,
      na = this.#afterIdx + delta;
    if (nb < 0 || na >= this.#commits.length) return;
    this.#beforeIdx = nb;
    this.#afterIdx = na;
    this.#syncGitUI();
    this.#fetchGitDiff();
  }

  #stepBefore(delta) {
    const n = this.#beforeIdx + delta;
    if (n < 0 || n >= this.#afterIdx) return;
    this.#beforeIdx = n;
    this.#syncGitUI();
    this.#fetchGitDiff();
  }

  #stepAfter(delta) {
    const n = this.#afterIdx + delta;
    if (n <= this.#beforeIdx || n >= this.#commits.length) return;
    this.#afterIdx = n;
    this.#syncGitUI();
    this.#fetchGitDiff();
  }

  async #fetchGitDiff() {
    const before = this.#commits[this.#beforeIdx].sha;
    const after = this.#commits[this.#afterIdx].sha;
    const res = await fetch(`/diff-data?before=${before}&after=${after}`);
    const data = await res.json();
    if (data.filename) {
      document.title = `Diff: ${data.filename}`;
      this.#filenameDisplay.textContent = data.filename;
    }
    this.#state.setInitialData(data.old, data.new);
  }

  // ── Event Wiring ────────────────────────────────────────────────────────────

  #wireEvents() {
    // Toggles
    this.#presToggle.onchange = () =>
      this.#state.togglePresentation(this.#presToggle.checked);
    this.#showRemToggle.onchange = () =>
      this.#state.toggleShowRemovedPresentation(this.#showRemToggle.checked);

    // View mode radios
    document.querySelectorAll('input[name="view"]').forEach((r) => {
      r.onchange = () => this.#state.setViewMode(r.value);
    });

    // File inputs
    this.#fileInputA.onchange = (e) =>
      this.#loadFile(e, (data) => this.#state.setFileA(data));
    this.#fileInputB.onchange = (e) =>
      this.#loadFile(e, (data) => this.#state.setFileB(data));

    // Git panel toggle
    this.#gitControls.onclick = () => {
      this.#gitPanel.classList.toggle("open");
      this.#gitControls.classList.toggle(
        "active",
        this.#gitPanel.classList.contains("open"),
      );
    };
    el("btn-close-git").onclick = () => {
      this.#gitPanel.classList.remove("open");
      this.#gitControls.classList.remove("active");
    };

    // Git navigation
    this.#btnGitPrev.onclick = () => this.#stepBoth(-1);
    this.#btnGitNext.onclick = () => this.#stepBoth(1);
    this.#btnBeforePrev.onclick = () => this.#stepBefore(-1);
    this.#btnBeforeNext.onclick = () => this.#stepBefore(1);
    this.#btnAfterPrev.onclick = () => this.#stepAfter(-1);
    this.#btnAfterNext.onclick = () => this.#stepAfter(1);
    this.#selectBefore.onchange = () => {
      const n = parseInt(this.#selectBefore.value, 10);
      this.#beforeIdx = n;
      if (this.#afterIdx <= this.#beforeIdx)
        this.#afterIdx = this.#beforeIdx + 1;
      this.#syncGitUI();
      this.#fetchGitDiff();
    };
    this.#selectAfter.onchange = () => {
      const n = parseInt(this.#selectAfter.value, 10);
      this.#afterIdx = n;
      if (this.#beforeIdx >= this.#afterIdx)
        this.#beforeIdx = this.#afterIdx - 1;
      this.#syncGitUI();
      this.#fetchGitDiff();
    };

    // Buttons
    this.#btnReset.onclick = () => {
      this.#state.resetLayout();
      this.#closeModal();
      this.#sidebar.classList.remove("open");
    };
    this.#btnMeta.onclick = () => this.#sidebar.classList.toggle("open");
    this.#btnBack.onclick = () => this.#state.popSubpatch();

    el("btn-close-modal").onclick = () => this.#closeModal();
    el("btn-close-sidebar").onclick = () =>
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
    this.#patcher.addEventListener("box-click", (e) => this.#onBoxClick(e));
    this.#patcher.addEventListener("box-dblclick", (e) =>
      this.#onBoxDblClick(e),
    );

    // Shutdown beacon
    window.onpagehide = () => navigator.sendBeacon("/shutdown");

    // State changes
    this.#state.addEventListener("state-change", (e) =>
      this.#onStateChange(e.detail),
    );
  }

  // ── State Change Handler ────────────────────────────────────────────────────

  #onStateChange({ type, pivot }) {
    switch (type) {
      case "data":
      case "navigation":
        this.#viewToggles.hidden = false;
        this.#btnMeta.hidden = false;
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

  #syncView() {
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

  #onBoxClick({ detail: { box, originalEvent } }) {
    const clickedInfo = originalEvent
      .composedPath()
      .some((el) => el.classList?.contains("info-indicator"));
    if (clickedInfo) this.#openBoxModal(box);
  }

  #onBoxDblClick({ detail: { box, originalEvent } }) {
    const clickedInfo = originalEvent
      .composedPath()
      .some((el) => el.classList?.contains("info-indicator"));
    if (!clickedInfo) this.#state.enterSubpatch(box.id);
  }

  #openBoxModal(box) {
    if (box.diffState !== "modified" || !box.attrDiffs?.length) return;
    const html = renderBoxAttrDiffs(box.attrDiffs);
    if (!html) return;
    this.#modalContent.innerHTML = html;
    this.#modal.style.display = "block";
  }

  #closeModal() {
    this.#modal.style.display = "none";
  }

  // ── Zoom ────────────────────────────────────────────────────────────────────

  #zoom(level, e) {
    this.#state.setZoom(level, e ? { x: e.clientX, y: e.clientY } : undefined);
  }

  #applyZoom(pivot) {
    const w = this.#wrapper;
    const p = this.#patcher;
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

  async #loadFile(e, cb) {
    const file = e.target.files?.[0];
    if (!file) return;
    cb(JSON.parse(await file.text()));
  }
}

new PatcherApp();
