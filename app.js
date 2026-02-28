const container = document.getElementById("patcher-container");
const svgLayer = document.getElementById("patchline-svg");
const fileInputsDiv = document.getElementById("file-inputs");
const viewToggles = document.getElementById("view-toggles");
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

window.addEventListener("pagehide", () => {
    navigator.sendBeacon("/shutdown");
});

btnBack.addEventListener("click", () => {
    const prevState = navStack.pop();
    if (navStack.length === 0) btnBack.style.display = "none";
    dataA = prevState.dataA;
    dataB = prevState.dataB;
    if (dataA && dataB) currentDiffData = comparePatches(dataA, dataB);
    updateView(document.querySelector("input[name=\"view\"]:checked").value);
});

function navigateToSubpatch(pA, pB) {
    navStack.push({ dataA, dataB });
    btnBack.style.display = "inline-block";
    dataA = pA ? { patcher: pA } : null;
    dataB = pB ? { patcher: pB } : null;
    if (dataA && dataB) {
        currentDiffData = comparePatches(dataA, dataB);
    }
    updateView(document.querySelector("input[name=\"view\"]:checked").value);
}

document.querySelectorAll('input[name="view"]').forEach(radio => {
    radio.addEventListener("change", (e) => updateView(e.target.value));
});

function normalizePatchData(data) {
    if (!data || !data.patcher) return { boxes: [], lines: [] };
    return {
        boxes: (data.patcher.boxes || []).map(item => item.box),
        lines: (data.patcher.lines || []).map(item => item.patchline)
    };
}

function updateView(mode) {
    if (mode === "before") {
        const { boxes, lines } = normalizePatchData(dataA);
        render(boxes, lines, false);
    } else if (mode === "after") {
        const { boxes, lines } = normalizePatchData(dataB);
        render(boxes, lines, false);
    } else if (mode === "diff" && currentDiffData) {
        render(currentDiffData.boxes, currentDiffData.lines, true);
    }
}

function handleDataUpdate() {
    if (dataA && dataB) {
        currentDiffData = comparePatches(dataA, dataB);
        viewToggles.style.display = "block";
        const currentMode = document.querySelector('input[name="view"]:checked').value;
        updateView(currentMode);
    }
}

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

checkLocalServer();

function comparePatches(dataA, dataB) {
    const { boxes: boxesA, lines: linesA } = normalizePatchData(dataA);
    const { boxes: boxesB, lines: linesB } = normalizePatchData(dataB);

    const dictA = new Map(boxesA.map(b => [b.id, b]));
    const dictB = new Map(boxesB.map(b => [b.id, b]));

    const diffBoxes = [];
    const diffLines = [];

    for (const [id, boxA] of dictA.entries()) {
        const boxB = dictB.get(id);
        if (!boxB) {
            diffBoxes.push({ ...boxA, diffState: "removed", patcherA: boxA.patcher, patcherB: null });
        } else {
            const [xA, yA, wA, hA] = boxA.patching_rect;
            const [xB, yB, wB, hB] = boxB.patching_rect;
            const textA = boxA.text || boxA.maxclass;
            const textB = boxB.text || boxB.maxclass;
            const patcherAStr = boxA.patcher ? JSON.stringify(boxA.patcher) : "";
            const patcherBStr = boxB.patcher ? JSON.stringify(boxB.patcher) : "";
            
            const isContentModified = textA !== textB || patcherAStr !== patcherBStr || wA !== wB || hA !== hB;
            const isPositionModified = xA !== xB || yA !== yB;
            
            let diffState = "unchanged";
            if (isContentModified) {
                diffState = "modified";
            } else if (isPositionModified) {
                diffState = "moved";
            }
            
            diffBoxes.push({ ...boxB, diffState, patcherA: boxA.patcher, patcherB: boxB.patcher });
        }
    }

    for (const [id, boxB] of dictB.entries()) {
        if (!dictA.has(id)) {
            diffBoxes.push({ ...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher });
        }
    }

    const getLineSig = (l) => `${l.source.join(",")}-${l.destination.join(",")}`;
    const linesDictA = new Map(linesA.map(l => [getLineSig(l), l]));
    const linesDictB = new Map(linesB.map(l => [getLineSig(l), l]));

    for (const [sig, lineA] of linesDictA.entries()) {
        if (!linesDictB.has(sig)) {
            diffLines.push({ ...lineA, diffState: "removed" });
        } else {
            diffLines.push({ ...linesDictB.get(sig), diffState: "unchanged" });
        }
    }

    for (const [sig, lineB] of linesDictB.entries()) {
        if (!linesDictA.has(sig)) {
            diffLines.push({ ...lineB, diffState: "added" });
        }
    }

    return { boxes: diffBoxes, lines: diffLines };
}

function render(boxes, lines, isDiff) {
    container.querySelectorAll(".max-box").forEach(el => el.remove());
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
        el.style.minWidth = `${w}px`;
        el.style.height = `${h}px`;

        if (b.maxclass === "inlet") {
            const numDiv = document.createElement("div");
            numDiv.className = "io-number";
            numDiv.textContent = b.index || 1;
            el.appendChild(numDiv);
            
            const triDiv = document.createElement("div");
            triDiv.className = "io-triangle";
            el.appendChild(triDiv);
        } else if (b.maxclass === "outlet") {
            const triDiv = document.createElement("div");
            triDiv.className = "io-triangle";
            el.appendChild(triDiv);

            const numDiv = document.createElement("div");
            numDiv.className = "io-number";
            numDiv.textContent = b.index || 1;
            el.appendChild(numDiv);
        } else {
            const textSpan = document.createElement("span");
            textSpan.textContent = b.text || b.maxclass;
            el.appendChild(textSpan);
        }

        // Render inlets
        const numInlets = b.numinlets || 1;
        for (let i = 0; i < numInlets; i++) {
            const inlet = document.createElement("div");
            inlet.className = "inlet-point";
            inlet.style.left = `${(100 / (numInlets + 1)) * (i + 1)}%`;
            inlet.style.transform = "translateX(-50%)";
            el.appendChild(inlet);
        }

        // Render outlets
        const numOutlets = b.numoutlets || 1;
        for (let i = 0; i < numOutlets; i++) {
            const outlet = document.createElement("div");
            outlet.className = "outlet-point";
            outlet.style.left = `${(100 / (numOutlets + 1)) * (i + 1)}%`;
            outlet.style.transform = "translateX(-50%)";
            el.appendChild(outlet);
        }

        const hasSubpatch = isDiff ? (b.patcherA || b.patcherB) : b.patcher;
        if (hasSubpatch) {
            el.style.borderStyle = "double";
            el.style.borderWidth = "3px";
            el.style.cursor = "pointer";
            el.addEventListener("dblclick", () => {
                if (isDiff) navigateToSubpatch(b.patcherA, b.patcherB);
                else navigateToSubpatch(b.patcher, b.patcher);
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
            if (isDiff && l.diffState) path.classList.add(l.diffState);
            svgLayer.appendChild(path);
        }
    });
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
function setZoom(level) {
    zoomLevel = level;
    container.style.transform = `scale(${zoomLevel})`;
    document.getElementById("btn-zoom-reset").textContent = `${Math.round(zoomLevel * 100)}%`;
}

document.getElementById("btn-zoom-in").addEventListener("click", () => {
    setZoom(Math.min(zoomLevel + 0.1, 3.0));
});

document.getElementById("btn-zoom-out").addEventListener("click", () => {
    setZoom(Math.max(zoomLevel - 0.1, 0.1));
});

document.getElementById("btn-zoom-reset").addEventListener("click", () => {
    setZoom(1.0);
});

// Mouse wheel zoom
document.getElementById("patcher-wrapper").addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(Math.max(0.1, Math.min(zoomLevel + delta, 3.0)));
    }
});
