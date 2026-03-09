import { Box, DiffCollection, MaxPatchJSON, PatchLine } from "./DiffEngine.js";
import { BoxViewModel, LineViewModel } from "./components.js";

export class DiffPresenter {
  // NOTE: Hidden attributes
  static excludedKeys: Set<string> = new Set([
    "patcher",
    // "id",
    "patching_rect",
    "presentation_rect",
    "rect",
  ]);
  static process(
    patchA: MaxPatchJSON | undefined,
    patchB: MaxPatchJSON | undefined,
    diffs: DiffCollection<Box>,
  ): { boxes: BoxViewModel[]; lines: LineViewModel[] } {
    const safeA = patchA?.patcher
      ? patchA
      : { patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] } };
    const safeB = patchB?.patcher
      ? patchB
      : { patcher: { boxes: [], lines: [], rect: [0, 0, 0, 0] } };

    const boxesB = safeB.patcher.boxes.map((b: any) => b.box);

    const diffBoxes: BoxViewModel[] = [];
    // NOTE: Use separate maps to avoid key collisions when a heuristic match causes
    // a B-side box ID to equal a deleted A-side box ID.
    const diffMapByBId = new Map(
      diffs
        .filter((op) => op.type !== "deleted")
        .map((op) => [op.current.id, op]),
    );
    const deletedMapByAId = new Map(
      diffs
        .filter(
          (op): op is Extract<typeof op, { type: "deleted" }> =>
            op.type === "deleted",
        )
        .map((op) => [op.previous.id, op]),
    );
    const idMapAtoB = new Map<string, string>();

    for (const boxB of boxesB) {
      const op = diffMapByBId.get(boxB.id);

      if (!op) {
        diffBoxes.push({
          ...boxB,
          diffState: "unchanged",
          patcherA: boxB.patcher,
          patcherB: boxB.patcher,
        } as BoxViewModel);
        idMapAtoB.set(boxB.id, boxB.id);
        continue;
      }

      if (op.type === "added") {
        diffBoxes.push({
          ...boxB,
          diffState: "added",
          patcherA: null,
          patcherB: boxB.patcher,
        } as BoxViewModel);
      } else if (op.type === "modified" || op.type === "moved") {
        const attrDiffs = Object.entries(op.fields)
          .filter(([key]) => !this.excludedKeys.has(key))
          .map(([key, delta]) => ({
            key,
            old: delta?.from,
            new: delta?.to,
          }));
        diffBoxes.push({
          ...boxB,
          diffState: op.type,
          attrDiffs,
          patcherA: op.previous.patcher,
          patcherB: boxB.patcher,
          oldText: op.previous.text ?? op.previous.maxclass,
        } as BoxViewModel);
        idMapAtoB.set(op.previous.id, boxB.id);
      }
    }

    for (const op of deletedMapByAId.values()) {
      diffBoxes.push({
        ...op.previous,
        id: `${op.previous.id}_removed`,
        diffState: "removed",
        patcherA: op.previous.patcher,
        patcherB: null,
      } as BoxViewModel);
    }

    const linesA = safeA.patcher.lines?.map((l) => l.patchline) ?? [];
    const linesB = safeB.patcher.lines?.map((l) => l.patchline) ?? [];

    return {
      boxes: structuredClone(diffBoxes),
      lines: structuredClone(this.processLines(linesA, linesB, idMapAtoB)),
    };
  }

  private static processLines(
    linesA: PatchLine[],
    linesB: PatchLine[],
    idMapAtoB: Map<string, string>,
  ): LineViewModel[] {
    const diffLines: LineViewModel[] = [];
    const getLineKey = (src: [string, number], dst: [string, number]) =>
      `${src.join(",")}-${dst.join(",")}`;
    const linesMapB = new Map(
      linesB.map((l) => [getLineKey(l.source, l.destination), l]),
    );
    const processedLinesB = new Set<string>();

    for (const lA of linesA) {
      const mappedSrcId = idMapAtoB.get(lA.source[0]);
      const mappedDstId = idMapAtoB.get(lA.destination[0]);

      if (mappedSrcId && mappedDstId) {
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
        source: [mappedSrcId ?? `${lA.source[0]}_removed`, lA.source[1]],
        destination: [
          mappedDstId ?? `${lA.destination[0]}_removed`,
          lA.destination[1],
        ],
        diffState: "removed",
      });
    }

    for (const [key, lB] of linesMapB) {
      if (!processedLinesB.has(key))
        diffLines.push({ ...lB, diffState: "added" });
    }

    return diffLines;
  }

  static getMetadata(data?: MaxPatchJSON): Record<string, unknown> {
    if (!data?.patcher) return {};
    // NOTE: Hidden attributes
    const { boxes, lines, rect, ...metadata } = data.patcher;
    return metadata;
  }

  static compareMetadata(dataA?: MaxPatchJSON, dataB?: MaxPatchJSON) {
    const metaA = this.getMetadata(dataA);
    const metaB = this.getMetadata(dataB);
    const diffs: { key: string; old?: unknown; new?: unknown }[] = [];
    const allKeys = new Set([...Object.keys(metaA), ...Object.keys(metaB)]);

    for (const key of allKeys) {
      if (JSON.stringify(metaA[key]) !== JSON.stringify(metaB[key])) {
        diffs.push({ key, old: metaA[key], new: metaB[key] });
      }
    }
    return diffs;
  }
}
