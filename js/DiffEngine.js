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
            boxes: (patcher.boxes ?? []).map(item => {
                const box = structuredClone(item.box);
                if (box.numinlets === undefined) box.numinlets = 1;
                if (box.numoutlets === undefined) box.numoutlets = 1;
                return box;
            }),
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
        const {boxes: boxesA, lines: linesA} = this.normalize(dataA);
        const {boxes: boxesB, lines: linesB} = this.normalize(dataB);

        const mapA = new Map(boxesA.map(b => [b.id, b]));
        const mapB = new Map(boxesB.map(b => [b.id, b]));

        const ignoredAttrs = new Set([
            "id", "patching_rect", "text", "maxclass", "patcher",
            "presentation", "presentation_rect"
        ]);

        const allIds = new Set([...mapA.keys(), ...mapB.keys()]);
        const diffBoxes = [];

        for (const id of allIds) {
            const boxA = mapA.get(id);
            const boxB = mapB.get(id);

            if (!boxB) {
                diffBoxes.push({...boxA, diffState: "removed", patcherA: boxA.patcher, patcherB: null});
                continue;
            }
            if (!boxA) {
                diffBoxes.push({...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher});
                continue;
            }

            const attrDiffs = this.compareObjects(boxA, boxB, "", ignoredAttrs);
            const textA = boxA.text ?? boxA.maxclass;
            const textB = boxB.text ?? boxB.maxclass;

            let isContentModified = textA !== textB ||
                attrDiffs.length > 0 ||
                boxA.presentation !== boxB.presentation ||
                !this.isRectEqual(boxA.presentation_rect, boxB.presentation_rect);

            if (!isContentModified) {
                if (JSON.stringify(boxA.patcher) !== JSON.stringify(boxB.patcher)) {
                    isContentModified = true;
                }
            }

            const isPositionOrSizeModified = boxA.patching_rect !== boxB.patching_rect;

            const diffState = isContentModified ? "modified" : (isPositionOrSizeModified ? "moved" : "unchanged");

            diffBoxes.push({
                ...boxB,
                diffState,
                patcherA: boxA.patcher,
                patcherB: boxB.patcher,
                oldText: textA,
                attrDiffs
            });
        }

        const getLineKey = (l) => `${l.source.join(",")}-${l.destination.join(",")}`;
        const linesMapA = new Map(linesA.map(l => [getLineKey(l), l]));
        const linesMapB = new Map(linesB.map(l => [getLineKey(l), l]));

        const allLineKeys = new Set([...linesMapA.keys(), ...linesMapB.keys()]);
        const diffLines = [];

        for (const key of allLineKeys) {
            const lA = linesMapA.get(key);
            const lB = linesMapB.get(key);

            if (!lB) {
                diffLines.push({...lA, diffState: "removed"});
            } else if (!lA) {
                diffLines.push({...lB, diffState: "added"});
            } else {
                diffLines.push({...lB, diffState: "unchanged"});
            }
        }

        return {boxes: diffBoxes, lines: diffLines};
    }

    static isRectEqual(r1, r2) {
        if (r1 === r2) return true;
        if (!r1 || !r2) return false;
        return r1[0] === r2[0] && r1[1] === r2[1] && r1[2] === r2[2] && r1[3] === r2[3];
    }

    /**
     * Recursively compares two objects and returns a list of differences.
     */
    static compareObjects(objA, objB, path = "", ignored = new Set()) {
        const diffs = [];
        const keysA = Object.keys(objA ?? {});
        const keysB = Object.keys(objB ?? {});
        const allKeys = new Set([...keysA, ...keysB]);

        for (const key of allKeys) {
            if (ignored.has(key)) continue;

            const valA = objA?.[key];
            const valB = objB?.[key];
            const currentPath = path ? `${path}.${key}` : key;

            if (valA === valB) continue;

            const isObjA = this.isObject(valA);
            const isObjB = this.isObject(valB);

            if (isObjA && isObjB) {
                diffs.push(...this.compareObjects(valA, valB, currentPath));
            } else {
                if (JSON.stringify(valA) !== JSON.stringify(valB)) {
                    diffs.push({key: currentPath, old: valA, new: valB});
                }
            }
        }
        return diffs;
    }

    static isObject(val) {
        return val !== null && typeof val === 'object' && !Array.isArray(val);
    }

    static getMetadata(data) {
        const {boxes, lines, ...metadata} = data?.patcher ?? {};
        return metadata;
    }

    static compareMetadata(dataA, dataB) {
        if (!dataA?.patcher || !dataB?.patcher) return [];
        return this.compareObjects(dataA.patcher, dataB.patcher, "", new Set(["boxes", "lines"]));
    }
}
