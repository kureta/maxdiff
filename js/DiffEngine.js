/**
 * Logic for calculating differences between two Max/MSP patches.
 */
export class DiffEngine {
    /**
     * Extracts and normalizes patcher data.
     * @param {Object} data - Raw patcher JSON data.
     * @returns {{boxes: Array, lines: Array}}
     */
    static normalize(data) {
        const patcher = data?.patcher ?? {};
        return {
            boxes: (patcher.boxes ?? []).map(item => structuredClone(item.box)),
            lines: (patcher.lines ?? []).map(item => structuredClone(item.patchline))
        };
    }

    /**
     * Compares two patcher datasets.
     * @param {Object} dataA - Old patcher data.
     * @param {Object} dataB - New patcher data.
     * @returns {{boxes: Array, lines: Array}}
     */
    static compare(dataA, dataB) {
        const { boxes: boxesA, lines: linesA } = this.normalize(dataA);
        const { boxes: boxesB, lines: linesB } = this.normalize(dataB);

        const mapA = new Map(boxesA.map(b => [b.id, b]));
        const mapB = new Map(boxesB.map(b => [b.id, b]));
        
        const ignoredAttrs = new Set([
            "id", "patching_rect", "text", "maxclass", "patcher", 
            "presentation", "presentation_rect"
        ]);

        const allIds = new Set([...mapA.keys(), ...mapB.keys()]);
        const diffBoxes = Array.from(allIds).map(id => {
            const boxA = mapA.get(id);
            const boxB = mapB.get(id);

            if (!boxB) return { ...boxA, diffState: "removed", patcherA: boxA.patcher, patcherB: null };
            if (!boxA) return { ...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher };

            const attrDiffs = this.compareObjects(boxA, boxB, "", ignoredAttrs);
            const textA = boxA.text ?? boxA.maxclass;
            const textB = boxB.text ?? boxB.maxclass;

            const isContentModified = textA !== textB ||
                JSON.stringify(boxA.patcher) !== JSON.stringify(boxB.patcher) ||
                boxA.patching_rect[2] !== boxB.patching_rect[2] ||
                boxA.patching_rect[3] !== boxB.patching_rect[3] ||
                attrDiffs.length > 0 ||
                boxA.presentation !== boxB.presentation ||
                JSON.stringify(boxA.presentation_rect) !== JSON.stringify(boxB.presentation_rect);

            const isPositionModified = boxA.patching_rect[0] !== boxB.patching_rect[0] || 
                                       boxA.patching_rect[1] !== boxB.patching_rect[1];

            const diffState = isContentModified ? "modified" : (isPositionModified ? "moved" : "unchanged");
            
            return { 
                ...boxB, 
                diffState, 
                patcherA: boxA.patcher, 
                patcherB: boxB.patcher, 
                oldText: textA, 
                attrDiffs 
            };
        });

        const getLineKey = (l) => `${l.source.join(",")}-${l.destination.join(",")}`;
        const linesMapA = new Map(linesA.map(l => [getLineKey(l), l]));
        const linesMapB = new Map(linesB.map(l => [getLineKey(l), l]));

        const allLineKeys = new Set([...linesMapA.keys(), ...linesMapB.keys()]);
        const diffLines = Array.from(allLineKeys).map(key => {
            const lA = linesMapA.get(key);
            const lB = linesMapB.get(key);
            
            if (!lB) return { ...lA, diffState: "removed" };
            if (!lA) return { ...lB, diffState: "added" };
            return { ...lB, diffState: "unchanged" };
        });

        return { boxes: diffBoxes, lines: diffLines };
    }

    /**
     * Recursively compares two objects and returns a list of differences.
     */
    static compareObjects(objA, objB, path = "", ignored = new Set()) {
        const diffs = [];
        const allKeys = new Set([...Object.keys(objA ?? {}), ...Object.keys(objB ?? {})]);

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
        return val !== null && typeof val === 'object' && !Array.isArray(val);
    }

    static getMetadata(data) {
        const { boxes, lines, ...metadata } = data?.patcher ?? {};
        return metadata;
    }

    static compareMetadata(dataA, dataB) {
        if (!dataA?.patcher || !dataB?.patcher) return [];
        return this.compareObjects(dataA.patcher, dataB.patcher, "", new Set(["boxes", "lines"]));
    }
}
