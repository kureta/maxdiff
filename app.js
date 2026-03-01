const container = document.getElementById("patcher-container");
const svgLayer = document.getElementById("patchline-svg");
const fileInputsDiv = document.getElementById("file-inputs");
const viewToggles = document.getElementById("view-toggles");
const wrapper = document.getElementById("patcher-wrapper");
const svgNS = "http://www.w3.org/2000/svg";

let dataA = null;
let dataB = null;
let currentDiffData = null;
let zoomLevel = 1.0;

const btnBack = document.createElement("button");
btnBack.id = "btn-back";
btnBack.textContent = "Back to Parent";
btnBack.style.display = "none";
document.getElementById("controls").appendChild(btnBack);

const navStack = [];

// Modal elements
const modal = document.getElementById("details-modal");
const modalContent = document.getElementById("diff-content");
const closeButton = document.querySelector(".close-button");

// Sidebar elements
const metadataSidebar = document.getElementById("metadata-sidebar");
const metadataContent = document.getElementById("metadata-content");
const btnMetadata = document.getElementById("btn-metadata");
const btnCloseSidebar = document.getElementById("btn-close-sidebar");

// --- Event Listeners ---

closeButton.addEventListener("click", () => modal.style.display = "none");

window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
});

window.addEventListener("pagehide", () => navigator.sendBeacon("/shutdown"));

btnBack.addEventListener("click", () => {
    const prevState = navStack.pop();
    if (navStack.length === 0) btnBack.style.display = "none";
    dataA = prevState.dataA;
    dataB = prevState.dataB;
    if (dataA || dataB) currentDiffData = comparePatches(dataA, dataB);
    updateView(document.querySelector("input[name=\"view\"]:checked").value);
});

btnMetadata.addEventListener("click", () => metadataSidebar.classList.toggle("open"));
btnCloseSidebar.addEventListener("click", () => metadataSidebar.classList.remove("open"));

document.querySelectorAll('input[name="view"]').forEach(radio => {
    radio.addEventListener("change", (e) => updateView(e.target.value));
});

document.getElementById("fileInputA").addEventListener("change", (e) => {
    handleFile(e, (data) => {
        dataA = data;
        handleDataUpdate();
    });
});

document.getElementById("fileInputB").addEventListener("change", (e) => {
    handleFile(e, (data) => {
        dataB = data;
        handleDataUpdate();
    });
});

document.getElementById("btn-reset-layout").addEventListener("click", () => {
    handleDataUpdate();
});

// --- Core Logic ---

function navigateToSubpatch(pA, pB) {
    navStack.push({dataA, dataB});
    btnBack.style.display = "inline-block";
    dataA = pA ? {patcher: pA} : null;
    dataB = pB ? {patcher: pB} : null;
    if (dataA || dataB) {
        currentDiffData = comparePatches(dataA, dataB);
    }
    updateView(document.querySelector("input[name=\"view\"]:checked").value);
}

function normalizePatchData(data) {
    if (!data || !data.patcher) return {boxes: [], lines: []};
    return {
        boxes: (data.patcher.boxes || []).map(item => JSON.parse(JSON.stringify(item.box))),
        lines: (data.patcher.lines || []).map(item => JSON.parse(JSON.stringify(item.patchline)))
    };
}

function updateView(mode) {
    if (mode === "before") {
        const {boxes, lines} = normalizePatchData(dataA);
        render(boxes, lines, false);
    } else if (mode === "after") {
        const {boxes, lines} = normalizePatchData(dataB);
        render(boxes, lines, false);
    } else if (mode === "diff" && currentDiffData) {
        render(currentDiffData.boxes, currentDiffData.lines, true);
    }
}

function handleDataUpdate() {
    if (!dataA && !dataB) return;

    currentDiffData = comparePatches(dataA, dataB);
    viewToggles.style.display = "block";

    const metaDiffs = compareMetadata(dataA, dataB);

    btnMetadata.style.display = "inline-block";
    renderMetadataDiffs(metaDiffs);

    if (metaDiffs.length > 0) {
        btnMetadata.disabled = false;
    } else {
        btnMetadata.disabled = true;
        metadataSidebar.classList.remove("open");
    }

    const currentMode = document.querySelector('input[name="view"]:checked').value;
    updateView(currentMode);
}

async function checkLocalServer() {
    try {
        const response = await fetch("/diff-data");
        if (response.ok) {
            const data = await response.json();
            fileInputsDiv.style.display = "none";

            if (data.filename) {
                document.title = `Diff: ${data.filename}`;
            }

            dataA = data.old;
            dataB = data.new;
            handleDataUpdate();
        }
    } catch (error) {
        console.log("Running in standalone mode. Awaiting manual file input.");
    }
}

function handleFile(event, callback) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => callback(JSON.parse(e.target.result));
    reader.readAsText(file);
}

// --- Comparison Logic ---

function compareMetadata(dataA, dataB) {
    if (!dataA || !dataB || !dataA.patcher || !dataB.patcher) return [];

    const patcherA = dataA.patcher;
    const patcherB = dataB.patcher;
    const diffs = [];

    const allKeys = new Set([...Object.keys(patcherA), ...Object.keys(patcherB)]);
    const ignoredKeys = new Set(["boxes", "lines"]);

    for (const key of allKeys) {
        if (ignoredKeys.has(key)) continue;

        const valA = patcherA[key];
        const valB = patcherB[key];

        if (JSON.stringify(valA) !== JSON.stringify(valB)) {
            if (isObject(valA) && isObject(valB)) {
                diffs.push(...compareObjectDeep(valA, valB, key));
            } else {
                diffs.push({key, old: valA, new: valB});
            }
        }
    }
    return diffs;
}

function isObject(val) {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function compareObjectDeep(objA, objB, parentKey) {
    const diffs = [];
    const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

    for (const key of allKeys) {
        const valA = objA[key];
        const valB = objB[key];
        const currentKey = `${parentKey}.${key}`;

        if (JSON.stringify(valA) !== JSON.stringify(valB)) {
            if (isObject(valA) && isObject(valB)) {
                diffs.push(...compareObjectDeep(valA, valB, currentKey));
            } else {
                diffs.push({key: currentKey, old: valA, new: valB});
            }
        }
    }
    return diffs;
}

function comparePatches(dataA, dataB) {
    const {boxes: boxesA, lines: linesA} = normalizePatchData(dataA);
    const {boxes: boxesB, lines: linesB} = normalizePatchData(dataB);

    const dictA = new Map(boxesA.map(b => [b.id, b]));
    const dictB = new Map(boxesB.map(b => [b.id, b]));

    const diffBoxes = [];
    const diffLines = [];

    for (const [id, boxA] of dictA.entries()) {
        const boxB = dictB.get(id);
        if (!boxB) {
            diffBoxes.push({...boxA, diffState: "removed", patcherA: boxA.patcher, patcherB: null});
        } else {
            const [xA, yA, wA, hA] = boxA.patching_rect;
            const [xB, yB, wB, hB] = boxB.patching_rect;
            const textA = boxA.text || boxA.maxclass;
            const textB = boxB.text || boxB.maxclass;
            const patcherAStr = boxA.patcher ? JSON.stringify(boxA.patcher) : "";
            const patcherBStr = boxB.patcher ? JSON.stringify(boxB.patcher) : "";

            // Compare attributes
            const attrDiffs = [];
            const allKeys = new Set([...Object.keys(boxA), ...Object.keys(boxB)]);
            const ignoredKeys = new Set(["id", "patching_rect", "text", "maxclass", "numinlets", "numoutlets", "patcher", "outlettype"]);

            for (const key of allKeys) {
                if (ignoredKeys.has(key)) continue;
                if (JSON.stringify(boxA[key]) !== JSON.stringify(boxB[key])) {
                    attrDiffs.push({key, old: boxA[key], new: boxB[key]});
                }
            }

            const isContentModified = textA !== textB || patcherAStr !== patcherBStr || wA !== wB || hA !== hB || attrDiffs.length > 0;
            const isPositionModified = xA !== xB || yA !== yB;

            let diffState = "unchanged";
            if (isContentModified) {
                diffState = "modified";
            } else if (isPositionModified) {
                diffState = "moved";
            }

            diffBoxes.push({
                ...boxB, diffState, patcherA: boxA.patcher, patcherB: boxB.patcher, oldText: textA, attrDiffs
            });
        }
    }

    for (const [id, boxB] of dictB.entries()) {
        if (!dictA.has(id)) {
            diffBoxes.push({...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher});
        }
    }

    const getLineSig = (l) => `${l.source.join(",")}-${l.destination.join(",")}`;
    const linesDictA = new Map(linesA.map(l => [getLineSig(l), l]));
    const linesDictB = new Map(linesB.map(l => [getLineSig(l), l]));

    for (const [sig, lineA] of linesDictA.entries()) {
        if (!linesDictB.has(sig)) {
            diffLines.push({...lineA, diffState: "removed"});
        } else {
            diffLines.push({...linesDictB.get(sig), diffState: "unchanged"});
        }
    }

    for (const [sig, lineB] of linesDictB.entries()) {
        if (!linesDictA.has(sig)) {
            diffLines.push({...lineB, diffState: "added"});
        }
    }

    return {boxes: diffBoxes, lines: diffLines};
}

// --- Rendering Logic ---
// TODO: Metadata pane should also follow before/after/diff selection.
function renderMetadataDiffs(diffs) {
    metadataContent.innerHTML = "";
    diffs.forEach(diff => {
        const div = document.createElement("div");
        div.className = "meta-change";

        const keyDiv = document.createElement("div");
        keyDiv.className = "meta-key";
        keyDiv.textContent = diff.key;

        const oldDiv = document.createElement("pre");
        oldDiv.className = "meta-old";
        oldDiv.textContent = JSON.stringify(diff.old, null, 2);

        const newDiv = document.createElement("pre");
        newDiv.className = "meta-new";
        newDiv.textContent = JSON.stringify(diff.new, null, 2);

        div.appendChild(keyDiv);
        div.appendChild(oldDiv);
        div.appendChild(newDiv);
        metadataContent.appendChild(div);
    });
}

function showDetails(box) {
    modalContent.innerHTML = "";
    let hasContent = false;

    if (box.diffState === "modified" && box.attrDiffs && box.attrDiffs.length > 0) {
        box.attrDiffs.forEach(diff => {
            if (diff.key === "saved_attribute_attributes") {
                const oldAttrs = diff.old?.valueof || {};
                const newAttrs = diff.new?.valueof || {};
                const allAttrKeys = new Set([...Object.keys(oldAttrs), ...Object.keys(newAttrs)]);

                allAttrKeys.forEach(attrKey => {
                    const oldVal = JSON.stringify(oldAttrs[attrKey]);
                    const newVal = JSON.stringify(newAttrs[attrKey]);

                    if (oldVal !== newVal) {
                        createAttrChangeElement(modalContent, `saved_attribute_attributes -> ${attrKey}`, oldVal, newVal);
                        hasContent = true;
                    }
                });
            } else {
                createAttrChangeElement(modalContent, diff.key, JSON.stringify(diff.old), JSON.stringify(diff.new));
                hasContent = true;
            }
        });
    }

    if (hasContent) {
        modal.style.display = "block";
    }
}

function createAttrChangeElement(parent, key, oldVal, newVal) {
    const div = document.createElement("div");
    div.className = "attr-change";

    const name = document.createElement("div");
    name.className = "attr-name";
    name.textContent = key;

    const oldSpan = document.createElement("span");
    oldSpan.className = "attr-old";
    oldSpan.textContent = oldVal;

    const newSpan = document.createElement("span");
    newSpan.className = "attr-new";
    newSpan.textContent = newVal;

    div.appendChild(name);
    div.appendChild(oldSpan);
    div.appendChild(newSpan);
    parent.appendChild(div);
}

function applySpecialNaming(box) {
    let prefix = null;
    let suffix = null;

    switch (box.maxclass) {
        case "bpatcher":
            suffix = box.name;
            break;
        default:
            break;
    }

    return [prefix, suffix];
}

function getBoxDisplayName(box) {
    const attributes = box.saved_attribute_attributes?.valueof || {};
    const longName = attributes.parameter_longname;
    const shortName = attributes.parameter_shortname;

    const prettyName = longName || shortName;
    const basicName = box.text || box.maxclass;
    let displayName = prettyName || basicName;
    const subText = (prettyName == basicName) || (!prettyName) ? null : basicName;

    const [prefix, suffix] = applySpecialNaming(box);
    if (prefix) displayName = `${prefix} ${displayName}`;
    if (suffix) displayName = `${displayName} ${suffix}`;

    return {main: displayName, sub: subText};
}

function applySpecialStyle(box, element) {
    switch (box.maxclass) {
        case "panel":
            element.style.zIndex = 5;
            break
        default:
            break
    }
}

function render(boxes, lines, isDiff) {
    container.querySelectorAll(".max-box").forEach(el => el.remove());
    container.querySelectorAll(".patch-rect").forEach(el => el.remove());
    svgLayer.innerHTML = "";

    const boxDict = new Map();
    let maxX = 0;
    let maxY = 0;

    boxes.forEach(b => {
        boxDict.set(b.id, b);
        const [x, y, w, h] = b.patching_rect;
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);

        const el = document.createElement("div");
        el.className = `max-box ${b.maxclass || ""} ${isDiff ? (b.diffState || "") : ""}`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;

        applySpecialStyle(b, el);

        if (isDiff && b.diffState === "modified" && b.attrDiffs && b.attrDiffs.length > 0) {
            el.style.cursor = "help";
            const indicator = document.createElement("div");
            indicator.className = "info-indicator";
            indicator.textContent = "i";
            el.appendChild(indicator);
        }

        el.addEventListener("click", (e) => {
            if (el.getAttribute("data-dragged") === "true") return;
            if (e.detail === 1 && isDiff) showDetails(b);
        });

        makeDraggable(el, b, lines, boxDict);

        if (b.maxclass === "inlet" || b.maxclass === "outlet") {
            renderIO(el, b);
        } else {
            renderBoxContent(el, b, isDiff);
        }

        renderInletsOutlets(el, b);

        const hasSubpatch = isDiff ? (b.patcherA || b.patcherB) : b.patcher;
        if (hasSubpatch) {
            el.style.borderStyle = "double";
            el.style.borderWidth = "3px";
            el.style.cursor = "pointer";
            el.addEventListener("dblclick", () => {
                if (isDiff) navigateToSubpatch(b.patcherA, b.patcherB); else navigateToSubpatch(b.patcher, b.patcher);
            });
        }
        container.appendChild(el);
    });

    container.style.width = `${maxX + 200}px`;
    container.style.height = `${maxY + 200}px`;

    lines.forEach(l => {
        const src = boxDict.get(l.source[0]);
        const dst = boxDict.get(l.destination[0]);

        if (src && dst) {
            const path = createConnectionPath(src, dst, l);
            path.setAttribute("data-src", l.source[0]);
            path.setAttribute("data-dst", l.destination[0]);
            path.setAttribute("data-src-idx", l.source[1]);
            path.setAttribute("data-dst-idx", l.destination[1]);
            if (isDiff && l.diffState) path.classList.add(l.diffState);
            svgLayer.appendChild(path);
        }
    });
}

function renderIO(el, b) {
    const numDiv = document.createElement("div");
    numDiv.className = "io-number";
    numDiv.textContent = b.index || 1;

    const triDiv = document.createElement("div");
    triDiv.className = "io-triangle";

    if (b.maxclass === "inlet") {
        el.appendChild(numDiv);
        el.appendChild(triDiv);
    } else {
        el.appendChild(triDiv);
        el.appendChild(numDiv);
    }
}

function renderBoxContent(el, b, isDiff) {
    const displayInfo = getBoxDisplayName(b);
    const currentText = displayInfo.main;

    const contentDiv = document.createElement("div");
    contentDiv.className = "box-content";

    let mainTextEl;
    if (isDiff && b.diffState === "modified" && b.oldText && b.oldText !== (b.text || b.maxclass) && !displayInfo.sub) {
        const diffContainer = document.createElement("div");
        diffContainer.className = "diff-text-container";

        const oldSpan = document.createElement("div");
        oldSpan.className = "diff-old-text";
        oldSpan.textContent = b.oldText;

        const newSpan = document.createElement("div");
        newSpan.className = "diff-new-text";
        newSpan.textContent = currentText;

        diffContainer.appendChild(oldSpan);
        diffContainer.appendChild(newSpan);
        mainTextEl = diffContainer;
    } else {
        const span = document.createElement("span");
        span.className = "main-text";
        span.textContent = currentText;
        mainTextEl = span;
    }

    contentDiv.appendChild(mainTextEl);

    if (displayInfo.sub) {
        const subSpan = document.createElement("span");
        subSpan.className = "sub-text";
        subSpan.textContent = `(${displayInfo.sub})`;
        contentDiv.appendChild(subSpan);
    }

    el.appendChild(contentDiv);
}

function renderInletsOutlets(el, b) {
    const numInlets = b.numinlets || 1;
    for (let i = 0; i < numInlets; i++) {
        const inlet = document.createElement("div");
        inlet.className = "inlet-point";
        inlet.style.left = `${(100 / (numInlets + 1)) * (i + 1)}%`;
        inlet.style.transform = "translateX(-50%)";
        el.appendChild(inlet);
    }

    const numOutlets = b.numoutlets || 1;
    for (let i = 0; i < numOutlets; i++) {
        const outlet = document.createElement("div");
        outlet.className = "outlet-point";
        outlet.style.left = `${(100 / (numOutlets + 1)) * (i + 1)}%`;
        outlet.style.transform = "translateX(-50%)";
        el.appendChild(outlet);
    }
}

function createConnectionPath(src, dst, line) {
    const [sx, sy, sw, sh] = src.patching_rect;
    const [dx, dy, dw, dh] = dst.patching_rect;

    const srcOutlets = src.numoutlets || 1;
    const dstInlets = dst.numinlets || 1;
    const srcOutletIndex = line.source[1];
    const dstInletIndex = line.destination[1];

    const startX = sx + (sw / (srcOutlets + 1)) * (srcOutletIndex + 1);
    const startY = sy + sh;
    const endX = dx + (dw / (dstInlets + 1)) * (dstInletIndex + 1);
    const endY = dy;

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("class", "patchline");

    const ctrlY1 = startY + Math.max(20, Math.abs(endY - startY) * 0.4);
    const ctrlY2 = endY - Math.max(20, Math.abs(endY - startY) * 0.4);

    path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${ctrlY1}, ${endX} ${ctrlY2}, ${endX} ${endY}`);
    return path;
}

// Zoom functionality
function setZoom(newLevel, pivot) {
    const oldLevel = zoomLevel;
    newLevel = Math.max(0.2, Math.min(newLevel, 3.0));

    if (newLevel === oldLevel) return;

    const rect = wrapper.getBoundingClientRect();
    const px = pivot ? pivot.x - rect.left : wrapper.clientWidth / 2;
    const py = pivot ? pivot.y - rect.top : wrapper.clientHeight / 2;

    const scrollLeft = wrapper.scrollLeft;
    const scrollTop = wrapper.scrollTop;

    const ratio = newLevel / oldLevel;
    const newScrollLeft = (px + scrollLeft) * ratio - px;
    const newScrollTop = (py + scrollTop) * ratio - py;

    zoomLevel = newLevel;
    container.style.transform = `scale(${zoomLevel})`;
    document.getElementById("btn-zoom-reset").textContent = `${Math.round(zoomLevel * 100)}%`;

    wrapper.scrollLeft = newScrollLeft;
    wrapper.scrollTop = newScrollTop;
}

document.getElementById("btn-zoom-in").addEventListener("click", () => {
    setZoom(zoomLevel * 1.1);
});

document.getElementById("btn-zoom-out").addEventListener("click", () => {
    setZoom(zoomLevel / 1.1);
});

document.getElementById("btn-zoom-reset").addEventListener("click", () => {
    setZoom(1.0);
});

document.getElementById("patcher-wrapper").addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const pivot = { x: e.clientX, y: e.clientY };
        const factor = e.deltaY > 0 ? 1 / 1.05 : 1.05;
        setZoom(zoomLevel * factor, pivot);
    }
});

function makeDraggable(el, box, lines, boxDict) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let hasMoved = false;

    el.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseFloat(el.style.left);
        initialTop = parseFloat(el.style.top);
        el.style.zIndex = 100;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = (e.clientX - startX) / zoomLevel;
        const dy = (e.clientY - startY) / zoomLevel;

        if (dx === 0 && dy === 0) return;
        hasMoved = true;

        const newX = initialLeft + dx;
        const newY = initialTop + dy;

        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;

        box.patching_rect[0] = newX;
        box.patching_rect[1] = newY;

        updateConnectedLines(box, lines, boxDict);
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            el.style.zIndex = "";
            if (hasMoved) {
                el.setAttribute("data-dragged", "true");
                setTimeout(() => el.removeAttribute("data-dragged"), 0);
            }
        }
    });
}

function updateConnectedLines(movedBox, lines, boxDict) {
    lines.forEach(l => {
        if (l.source[0] === movedBox.id || l.destination[0] === movedBox.id) {
            const selector = `path[data-src="${l.source[0]}"][data-dst="${l.destination[0]}"][data-src-idx="${l.source[1]}"][data-dst-idx="${l.destination[1]}"]`;
            const path = svgLayer.querySelector(selector);
            if (path) {
                const src = boxDict.get(l.source[0]);
                const dst = boxDict.get(l.destination[0]);
                const newPath = createConnectionPath(src, dst, l);
                path.setAttribute("d", newPath.getAttribute("d"));
            }
        }
    });
}

checkLocalServer();
