/**
 * Logic for calculating differences between two Max/MSP patches.
 */

// Matching scores
const same_class = 50;
const same_text = 25;
const same_num_inlets_outlets = 25;
const max_connection_score = 50;
const similar_rectangles = 25;
const threshold = 100;

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

        const mapB = new Map(boxesB.map(b => [b.id, b]));

        // --- Pass 1: Anchors ---
        // Find all objects where id, maxclass, and id match perfectly.
        const matches = new Map(); // boxA -> boxB
        const matchedBIds = new Set();

        for (const boxA of boxesA) {
            const boxB = mapB.get(boxA.id);
            if (boxB) {
                if (boxA.maxclass === boxB.maxclass && boxA.id === boxB.id) {
                    matches.set(boxA, boxB);
                    matchedBIds.add(boxB.id);
                }
            }
        }

        // --- Pass 2: Relational ---
        const unmatchedA = boxesA.filter(b => !matches.has(b));
        const unmatchedB = boxesB.filter(b => !matchedBIds.has(b.id));

        const adjA = this.buildAdjacency(linesA);
        const adjB = this.buildAdjacency(linesB);
        
        // Map of matched IDs for connection scoring (Old ID -> New ID)
        const anchorMap = new Map();
        for (const [a, b] of matches) {
            anchorMap.set(a.id, b.id);
        }

        const candidates = [];

        for (const boxA of unmatchedA) {
            for (const boxB of unmatchedB) {
                const score = this.calculateSimilarity(boxA, boxB, adjA, adjB, anchorMap);
                candidates.push({boxA, boxB, score});
            }
        }

        // Greedy matching
        candidates.sort((a, b) => b.score - a.score);

        for (const {boxA, boxB, score} of candidates) {
            if (matches.has(boxA) || matchedBIds.has(boxB.id)) continue;

            if (score >= threshold) {
                matches.set(boxA, boxB);
                matchedBIds.add(boxB.id);
            }
        }

        // --- Generate Box Diffs ---
        const diffBoxes = [];
        const ignoredAttrs = new Set([
            "id", "patching_rect", "text", "maxclass", "patcher",
            "presentation", "presentation_rect"
        ]);

        for (const [boxA, boxB] of matches) {
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

            const isPositionOrSizeModified = !this.isRectEqual(boxA.patching_rect, boxB.patching_rect);
            const diffState = isContentModified ? "modified" : (isPositionOrSizeModified ? "moved" : "unchanged");

            diffBoxes.push({
                ...boxB,
                id: boxB.id,
                originalId: boxA.id,
                diffState,
                patcherA: boxA.patcher,
                patcherB: boxB.patcher,
                oldText: textA,
                attrDiffs
            });
        }

        for (const boxA of unmatchedA) {
            if (!matches.has(boxA)) {
                diffBoxes.push({...boxA, id: boxA.id + "_removed", originalId: boxA.id, diffState: "removed", patcherA: boxA.patcher, patcherB: null});
            }
        }

        for (const boxB of unmatchedB) {
            if (!matchedBIds.has(boxB.id)) {
                diffBoxes.push({...boxB, diffState: "added", patcherA: null, patcherB: boxB.patcher});
            }
        }

        // --- Generate Line Diffs ---
        const idMapAtoB = new Map();
        for (const [boxA, boxB] of matches) {
            idMapAtoB.set(boxA.id, boxB.id);
        }

        const getLineKey = (src, dst) => `${src.join(",")}-${dst.join(",")}`;
        const linesMapB = new Map();
        for (const l of linesB) {
            linesMapB.set(getLineKey(l.source, l.destination), l);
        }

        const diffLines = [];
        const processedLinesB = new Set();
        const getOutputIdForA = (id) => idMapAtoB.has(id) ? idMapAtoB.get(id) : id + "_removed";

        for (const lA of linesA) {
            const srcId = lA.source[0];
            const dstId = lA.destination[0];
            const mappedSrc = idMapAtoB.get(srcId);
            const mappedDst = idMapAtoB.get(dstId);

            if (mappedSrc !== undefined && mappedDst !== undefined) {
                const keyInB = getLineKey([mappedSrc, lA.source[1]], [mappedDst, lA.destination[1]]);
                const lB = linesMapB.get(keyInB);

                if (lB) {
                    diffLines.push({...lB, diffState: "unchanged"});
                    processedLinesB.add(keyInB);
                    continue;
                }
            }

            const line = {...lA, source: [...lA.source], destination: [...lA.destination], diffState: "removed"};
            line.source[0] = getOutputIdForA(srcId);
            line.destination[0] = getOutputIdForA(dstId);
            diffLines.push(line);
        }

        for (const [key, lB] of linesMapB) {
            if (!processedLinesB.has(key)) {
                diffLines.push({...lB, diffState: "added"});
            }
        }

        return {boxes: diffBoxes, lines: diffLines};
    }

    static buildAdjacency(lines) {
        const adj = new Map();
        for (const l of lines) {
            const src = l.source[0];
            const dst = l.destination[0];
            if (!adj.has(src)) adj.set(src, new Set());
            if (!adj.has(dst)) adj.set(dst, new Set());
            adj.get(src).add(dst);
            adj.get(dst).add(src);
        }
        return adj;
    }

    static calculateSimilarity(boxA, boxB, adjA, adjB, anchorMap) {
        let score = 0;
        if (boxA.maxclass === boxB.maxclass) score += same_class;
        if ((boxA.text || "") === (boxB.text || "")) score += same_text;
        if (this.getIoM(boxA.patching_rect, boxB.patching_rect) > 0.8) score += similar_rectangles;
        if ((boxA.numinlets || 0) === (boxB.numinlets || 0) && 
            (boxA.numoutlets || 0) === (boxB.numoutlets || 0)) score += same_num_inlets_outlets;

        const neighborsA = adjA.get(boxA.id) || new Set();
        const neighborsB = adjB.get(boxB.id) || new Set();

        const countA = neighborsA.size;
        const countB = neighborsB.size;

        if (countA > 0 || countB > 0) {
            let shared = 0;
            for (const nA of neighborsA) {
                if (anchorMap.has(nA)) {
                    const expectedNB = anchorMap.get(nA);
                    if (neighborsB.has(expectedNB)) {
                        shared++;
                    }
                }
            }
            if (countA + countB === 0) return max_connection_score;
            const union = countA + countB - shared;
            score += (shared / union) * max_connection_score;
        }
        return score;
    }

    // Intersection over Minimum
    static getIoM(r1, r2) {
        if (!r1 || !r2) return 0;
        const x1 = Math.max(r1[0], r2[0]);
        const y1 = Math.max(r1[1], r2[1]);
        const x2 = Math.min(r1[0] + r1[2], r2[0] + r2[2]);
        const y2 = Math.min(r1[1] + r1[3], r2[1] + r2[3]);

        if (x2 <= x1 || y2 <= y1) return 0;

        const intersection = (x2 - x1) * (y2 - y1);
        const area1 = r1[2] * r1[3];
        const area2 = r2[2] * r2[3];
        
        if (area1 <= 0 || area2 <= 0) return 0;
        return intersection / Math.min(area1, area2);
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
