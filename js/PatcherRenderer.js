export class PatcherRenderer {
    static svgNS = "http://www.w3.org/2000/svg";
    static boxTags = {
        message: 'max-message',
        comment: 'max-comment',
        button: 'max-button',
        inlet: 'max-inlet',
        outlet: 'max-outlet',
        panel: 'max-panel'
    };

    constructor(container, svgLayer) {
        this.container = container;
        this.svgLayer = svgLayer;
    }

    clear() {
        this.container.querySelectorAll(".max-box").forEach(el => el.remove());
        this.svgLayer.innerHTML = "";
    }

    render(boxes, lines, isDiff, isPresentation, callbacks = {}) {
        this.clear();
        const boxDict = new Map();
        let maxX = 0, maxY = 0;

        boxes.filter(b => !isPresentation || b.presentation).forEach(box => {
            boxDict.set(box.id, box);
            const rect = (isPresentation && box.presentation_rect) ? box.presentation_rect : box.patching_rect;
            if (!rect) return;
            maxX = Math.max(maxX, rect[0] + rect[2]);
            maxY = Math.max(maxY, rect[1] + rect[3]);

            const el = this.createBoxElement(box, isDiff, lines, boxDict, isPresentation, callbacks);
            this.container.appendChild(el);
        });

        this.container.style.width = `${maxX + 200}px`;
        this.container.style.height = `${maxY + 200}px`;

        lines.forEach(l => {
            const src = boxDict.get(l.source[0]);
            const dst = boxDict.get(l.destination[0]);
            if (src && dst) {
                const path = this.createConnectionPath(src, dst, l, isPresentation);
                Object.assign(path.dataset, {
                    src: l.source[0],
                    dst: l.destination[0],
                    srcIdx: l.source[1],
                    dstIdx: l.destination[1]
                });
                if (isDiff && l.diffState) path.classList.add(l.diffState);
                this.svgLayer.appendChild(path);
            }
        });
    }

    createBoxElement(box, isDiff, lines, boxDict, isPresentation, callbacks) {
        const el = document.createElement(PatcherRenderer.boxTags[box.maxclass] || 'max-box');
        if (isPresentation) el.setAttribute('presentation', '');
        el.data = box;

        let clickTimeout = null;
        el.addEventListener("click", (e) => {
            if (el.dataset.dragged === "true") return;
            const hasSub = isDiff ? (box.patcherA || box.patcherB) : box.patcher;
            if (e.detail === 1 && isDiff) {
                if (hasSub) clickTimeout = setTimeout(() => { callbacks.onShowDetails?.(box); clickTimeout = null; }, 250);
                else callbacks.onShowDetails?.(box);
            }
        });

        if (callbacks.onMakeDraggable) {
            callbacks.onMakeDraggable(el, (nx, ny) => {
                const prop = isPresentation && box.presentation_rect ? 'presentation_rect' : 'patching_rect';
                if (!box[prop]) box[prop] = [0, 0, box.patching_rect[2], box.patching_rect[3]];
                [box[prop][0], box[prop][1]] = [nx, ny];
                this.updateConnectedLines(box, lines, boxDict, isPresentation);
            });
        }

        el.addEventListener("dblclick", () => {
            if (clickTimeout) { clearTimeout(clickTimeout); clickTimeout = null; }
            const pA = isDiff ? box.patcherA : box.patcher;
            const pB = isDiff ? box.patcherB : box.patcher;
            if (pA || pB) callbacks.onNavigateToSubpatch?.(pA, pB);
        });

        return el;
    }

    createConnectionPath(src, dst, line, isPresentation) {
        const sR = (isPresentation && src.presentation_rect) ? src.presentation_rect : src.patching_rect;
        const dR = (isPresentation && dst.presentation_rect) ? dst.presentation_rect : dst.patching_rect;
        const sX = sR[0] + (sR[2] / ((src.numoutlets || 1) + 1)) * (line.source[1] + 1);
        const sY = sR[1] + sR[3];
        const dX = dR[0] + (dR[2] / ((dst.numinlets || 1) + 1)) * (line.destination[1] + 1);
        const dY = dR[1];
        
        const path = document.createElementNS(PatcherRenderer.svgNS, "path");
        path.setAttribute("class", "patchline");
        const off = Math.max(20, Math.abs(dY - sY) * 0.4);
        path.setAttribute("d", `M ${sX} ${sY} C ${sX} ${sY + off}, ${dX} ${dY - off}, ${dX} ${dY}`);
        return path;
    }

    updateConnectedLines(movedBox, lines, boxDict, isPresentation) {
        lines.filter(l => l.source[0] === movedBox.id || l.destination[0] === movedBox.id).forEach(l => {
            const sel = `path[data-src="${l.source[0]}"][data-dst="${l.destination[0]}"][data-src-idx="${l.source[1]}"][data-dst-idx="${l.destination[1]}"]`;
            const path = this.svgLayer.querySelector(sel);
            if (path) {
                const src = boxDict.get(l.source[0]), dst = boxDict.get(l.destination[0]);
                if (src && dst) {
                    const newPath = this.createConnectionPath(src, dst, l, isPresentation);
                    path.setAttribute("d", newPath.getAttribute("d"));
                }
            }
        });
    }
}
