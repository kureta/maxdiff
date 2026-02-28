const container = document.getElementById("patcher-container");
const svgLayer = document.getElementById("patchline-svg");

const fileInputA = document.getElementById("fileInputA");
const fileInputB = document.getElementById("fileInputB");

let dataA = null;
let dataB = null;

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


const viewToggles = document.getElementById("view-toggles");
let currentDiffData = null;

document.querySelectorAll('input[name="view"]').forEach(radio => {
    radio.addEventListener("change", (e) => updateView(e.target.value));
});


function updateView(mode) {
    if (mode === "before") renderPatch(dataA);
    else if (mode === "after") renderPatch(dataB);
    else if (mode === "diff" && currentDiffData) renderDiff(currentDiffData);
}

function handleDataUpdate() {
    if (dataA && dataB) {
        currentDiffData = comparePatches(dataA, dataB);
        viewToggles.style.display = "block";
        const currentMode = document.querySelector('input[name="view"]:checked').value;
        updateView(currentMode);
    }
}

fileInputA.addEventListener("change", (e) => {
    handleFile(e, (data) => {
        dataA = data;
        handleDataUpdate();
    });
});

fileInputB.addEventListener("change", (e) => {
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
            fileInputA.parentElement.style.display = "none";
            fileInputB.parentElement.style.display = "none";
            
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
    const boxesA = dataA?.patcher?.boxes || [];
    const boxesB = dataB?.patcher?.boxes || [];
    const linesA = dataA?.patcher?.lines || [];
    const linesB = dataB?.patcher?.lines || [];

    const dictA = new Map(boxesA.map(item => [item.box.id, item.box]));
    const dictB = new Map(boxesB.map(item => [item.box.id, item.box]));

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
    const linesDictA = new Map(linesA.map(item => [getLineSig(item.patchline), item.patchline]));
    const linesDictB = new Map(linesB.map(item => [getLineSig(item.patchline), item.patchline]));

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

function renderDiff(diffData) {
    container.querySelectorAll(".max-box").forEach(el => el.remove());
    svgLayer.innerHTML = "";

    const boxDict = new Map();
    let maxX = 0;
    let maxY = 0;

    diffData.boxes.forEach(b => {
        boxDict.set(b.id, b);

        const [x, y, w, h] = b.patching_rect;
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);

        const el = document.createElement("div");
        el.className = `max-box ${b.diffState}`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.textContent = b.text || b.maxclass;
        
        if (b.patcherA || b.patcherB) {
            el.style.borderStyle = "double";
            el.style.borderWidth = "3px";
            el.style.cursor = "pointer";
            el.addEventListener("dblclick", () => navigateToSubpatch(b.patcherA, b.patcherB));
        }
        
        container.appendChild(el);
    });

    container.style.width = `${maxX + 200}px`;
    container.style.height = `${maxY + 200}px`;

    const svgNS = "http://www.w3.org/2000/svg";
    
    diffData.lines.forEach(l => {
        const src = boxDict.get(l.source[0]);
        const dst = boxDict.get(l.destination[0]);

        if (src && dst) {
            const [sx, sy, sw, sh] = src.patching_rect;
            const [dx, dy, dw, dh] = dst.patching_rect;

            const srcOutlets = src.numoutlets || 1;
            const dstInlets = dst.numinlets || 1;
            const srcOutletIndex = l.source[1];
            const dstInletIndex = l.destination[1];

            const startX = sx + (sw / (srcOutlets + 1)) * (srcOutletIndex + 1);
            const startY = sy + sh;
            const endX = dx + (dw / (dstInlets + 1)) * (dstInletIndex + 1);
            const endY = dy;

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("class", `patchline ${l.diffState}`);
            
            const ctrlY1 = startY + Math.max(20, Math.abs(endY - startY) * 0.4);
            const ctrlY2 = endY - Math.max(20, Math.abs(endY - startY) * 0.4);
            
            path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${ctrlY1}, ${endX} ${ctrlY2}, ${endX} ${endY}`);
            svgLayer.appendChild(path);
        }
    });
}

function renderPatch(data) {
    container.querySelectorAll(".max-box").forEach(el => el.remove());
    svgLayer.innerHTML = "";

    if (!data || !data.patcher) return;

    const boxes = data.patcher.boxes || [];
    const lines = data.patcher.lines || [];
    const boxDict = new Map();

    let maxX = 0;
    let maxY = 0;

    boxes.forEach(item => {
        const b = item.box;
        if (!b) return;
        
        boxDict.set(b.id, b);

        const [x, y, w, h] = b.patching_rect;
        
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);

        const el = document.createElement("div");
        el.className = "max-box";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.textContent = b.text || b.maxclass;
        
        if (b.patcher) {
            el.style.borderStyle = "double";
            el.style.borderWidth = "3px";
            el.style.cursor = "pointer";
            el.addEventListener("dblclick", () => navigateToSubpatch(b.patcher, b.patcher));
        }
        
        container.appendChild(el);
    });

    container.style.width = `${maxX + 200}px`;
    container.style.height = `${maxY + 200}px`;

    const svgNS = "http://www.w3.org/2000/svg";
    
    lines.forEach(item => {
        const l = item.patchline;
        if (!l) return;

        const src = boxDict.get(l.source[0]);
        const dst = boxDict.get(l.destination[0]);

        if (src && dst) {
            const [sx, sy, sw, sh] = src.patching_rect;
            const [dx, dy, dw, dh] = dst.patching_rect;

            const srcOutlets = src.numoutlets || 1;
            const dstInlets = dst.numinlets || 1;
            const srcOutletIndex = l.source[1];
            const dstInletIndex = l.destination[1];

            const startX = sx + (sw / (srcOutlets + 1)) * (srcOutletIndex + 1);
            const startY = sy + sh;
            const endX = dx + (dw / (dstInlets + 1)) * (dstInletIndex + 1);
            const endY = dy;

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("class", "patchline");
            
            const ctrlY1 = startY + Math.max(20, Math.abs(endY - startY) * 0.4);
            const ctrlY2 = endY - Math.max(20, Math.abs(endY - startY) * 0.4);
            
            path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${ctrlY1}, ${endX} ${ctrlY2}, ${endX} ${endY}`);
            svgLayer.appendChild(path);
        }
    });
}
