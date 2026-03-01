export class DiffEngine {
    static normalize(data) {
        if (!data?.patcher) return { boxes: [], lines: [] };
        // Deep copy the boxes and lines to avoid modifying the original data during dragging
        const boxes = (data.patcher.boxes || []).map(item => structuredClone(item.box));
        const lines = (data.patcher.lines || []).map(item => structuredClone(item.patchline));
        return { boxes, lines };
    }

    static compare(dataA, dataB) {
        const { boxes: boxesA, lines: linesA } = this.normalize(dataA);
        const { boxes: boxesB, lines: linesB } = this.normalize(dataB);

        const dictA = new Map(boxesA.map(b => [b.id, b]));
        const dictB = new Map(boxesB.map(b => [b.id, b]));
        const ignoredAttrs = new Set(["id", "patching_rect", "text", "maxclass", "patcher", "presentation", "presentation_rect"]);

        const diffBoxes = [...new Set([...dictA.keys(), ...dictB.keys()])].map(id => {
            const boxA = dictA.get(id);
            const boxB = dictB.get(id);

            if (!boxB) return { ...boxA, diffState: "removed", patcherA: boxA.patcher, patcherB: null };
            if (!boxA) return { ...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher };

            const attrDiffs = this.compareObjects(boxA, boxB, "", ignoredAttrs);
            const textA = boxA.text || boxA.maxclass;
            const textB = boxB.text || boxB.maxclass;

            const isContentModified = textA !== textB ||
                JSON.stringify(boxA.patcher) !== JSON.stringify(boxB.patcher) ||
                boxA.patching_rect[2] !== boxB.patching_rect[2] ||
                boxA.patching_rect[3] !== boxB.patching_rect[3] ||
                attrDiffs.length > 0 ||
                boxA.presentation !== boxB.presentation ||
                JSON.stringify(boxA.presentation_rect) !== JSON.stringify(boxB.presentation_rect);

            const isPositionModified = boxA.patching_rect[0] !== boxB.patching_rect[0] || boxA.patching_rect[1] !== boxB.patching_rect[1];

            const diffState = isContentModified ? "modified" : (isPositionModified ? "moved" : "unchanged");
            return { ...boxB, diffState, patcherA: boxA.patcher, patcherB: boxB.patcher, oldText: textA, attrDiffs };
        });

        const getSig = (l) => `${l.source.join(",")}-${l.destination.join(",")}`;
        const linesDictA = new Map(linesA.map(l => [getSig(l), l]));
        const linesDictB = new Map(linesB.map(l => [getSig(l), l]));

        const diffLines = [...new Set([...linesDictA.keys(), ...linesDictB.keys()])].map(sig => {
            const lA = linesDictA.get(sig);
            const lB = linesDictB.get(sig);
            if (!lB) return { ...lA, diffState: "removed" };
            if (!lA) return { ...lB, diffState: "added" };
            return { ...lB, diffState: "unchanged" };
        });

        return { boxes: diffBoxes, lines: diffLines };
    }

    static compareObjects(objA, objB, path = "", ignored = new Set()) {
        const diffs = [];
        const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]);

        for (const key of allKeys) {
            if (ignored.has(key)) continue;
            const valA = objA?.[key];
            const valB = objB?.[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (JSON.stringify(valA) !== JSON.stringify(valB)) {
                if (this.isObject(valA) && this.isObject(valB)) {
                    diffs.push(...this.compareObjects(valA, valB, currentPath));
                } else {
                    diffs.push({ key: currentPath, old: valA, new: valB });
                }
            }
        }
        return diffs;
    }

    static isObject(val) {
        return val && typeof val === 'object' && !Array.isArray(val);
    }

    static getMetadata(data) {
        if (!data?.patcher) return {};
        const { boxes, lines, ...metadata } = data.patcher;
        return metadata;
    }

    static compareMetadata(dataA, dataB) {
        if (!dataA?.patcher || !dataB?.patcher) return [];
        return this.compareObjects(dataA.patcher, dataB.patcher, "", new Set(["boxes", "lines"]));
    }
}
