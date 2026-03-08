import { MaxDiff } from "./NewDiffEngine.js";

export class DiffPresenter {
  /**
   * Projects the pure DiffCollection into the View-Model expected by MaxPatcher.
   */
  static process(patchA: any, patchB: any) {
    const safePatchA = patchA?.patcher
      ? patchA
      : { patcher: { boxes: [], lines: [] } };
    const safePatchB = patchB?.patcher
      ? patchB
      : { patcher: { boxes: [], lines: [] } };

    const diffs = MaxDiff.compare(safePatchA, safePatchB);

    const boxesB = safePatchB.patcher.boxes.map((b: any) => b.box);

    const diffBoxes = [];
    const diffMap = new Map();
    const idMapAtoB = new Map<string, string>();

    // 1. Index the pure diff operations by target box ID
    for (const op of diffs) {
      if (op.type === "deleted") diffMap.set(op.previous.id, op);
      else diffMap.set(op.current.id, op);
    }

    // 2. Map New Patch Boxes (Unchanged, Added, Modified, Moved)
    for (const boxB of boxesB) {
      const op = diffMap.get(boxB.id);

      if (!op) {
        diffBoxes.push({
          ...boxB,
          diffState: "unchanged",
          patcherA: boxB.patcher,
          patcherB: boxB.patcher,
        });
        idMapAtoB.set(boxB.id, boxB.id);
        continue;
      }

      if (op.type === "added") {
        diffBoxes.push({
          ...boxB,
          diffState: "added",
          patcherA: null,
          patcherB: boxB.patcher,
        });
      } else if (op.type === "modified" || op.type === "moved") {
        const attrDiffs = Object.entries(op.fields).map(
          ([key, delta]: [string, any]) => ({
            key,
            old: delta.from,
            new: delta.to,
          }),
        );

        diffBoxes.push({
          ...boxB,
          diffState: op.type,
          attrDiffs,
          patcherA: op.previous.patcher,
          patcherB: boxB.patcher,
          oldText: op.previous.text ?? op.previous.maxclass,
        });
        idMapAtoB.set(op.previous.id, boxB.id);
      }
    }

    // 3. Map Old Patch Boxes (Deleted)
    for (const op of diffs) {
      if (op.type === "deleted") {
        diffBoxes.push({
          ...op.previous,
          id: op.previous.id + "_removed",
          diffState: "removed",
          patcherA: op.previous.patcher,
          patcherB: null,
        });
      }
    }

    // 4. Resolve Lines based on mapped Box IDs
    const linesA = safePatchA.patcher.lines?.map((l: any) => l.patchline) || [];
    const linesB = safePatchB.patcher.lines?.map((l: any) => l.patchline) || [];
    const diffLines = this.processLines(linesA, linesB, idMapAtoB);

    return { boxes: diffBoxes, lines: diffLines };
  }

  private static processLines(
    linesA: any[],
    linesB: any[],
    idMapAtoB: Map<string, string>,
  ) {
    const diffLines = [];
    const getLineKey = (src: any[], dst: any[]) =>
      `${src.join(",")}-${dst.join(",")}`;
    const linesMapB = new Map(
      linesB.map((l) => [getLineKey(l.source, l.destination), l]),
    );
    const processedLinesB = new Set();

    const getOutputIdForA = (id: string) =>
      idMapAtoB.has(id) ? idMapAtoB.get(id) : id + "_removed";

    for (const lA of linesA) {
      const mappedSrcId = idMapAtoB.get(lA.source[0]);
      const mappedDstId = idMapAtoB.get(lA.destination[0]);

      if (mappedSrcId !== undefined && mappedDstId !== undefined) {
        const keyInB = getLineKey(
          [mappedSrcId, lA.source[1]],
          [mappedDstId, lA.destination[1]],
        );
        const lB = linesMapB.get(keyInB);

        if (lB) {
          diffLines.push({ ...lB, diffState: "unchanged" });
          processedLinesB.add(keyInB);
          continue;
        }
      }

      diffLines.push({
        ...lA,
        source: [getOutputIdForA(lA.source[0]), lA.source[1]],
        destination: [getOutputIdForA(lA.destination[0]), lA.destination[1]],
        diffState: "removed",
      });
    }

    for (const [key, lB] of linesMapB) {
      if (!processedLinesB.has(key))
        diffLines.push({ ...lB, diffState: "added" });
    }

    return diffLines;
  }

  static getMetadata(data: any) {
    const { boxes, lines, ...metadata } = data?.patcher ?? {};
    return metadata;
  }

  static compareMetadata(dataA: any, dataB: any) {
    const metaA = this.getMetadata(dataA);
    const metaB = this.getMetadata(dataB);
    const diffs = [];
    const allKeys = new Set([...Object.keys(metaA), ...Object.keys(metaB)]);

    for (const key of allKeys) {
      if (JSON.stringify(metaA[key]) !== JSON.stringify(metaB[key])) {
        diffs.push({ key, old: metaA[key], new: metaB[key] });
      }
    }
    return diffs;
  }
}
