import {
  ProcessedDocumentPayload,
  DeterministicDiffResult,
  DeterministicDiffChunk,
  ComparisonChangeType,
} from "@/types";

export function calculateTextSimilarity(str1: string, str2: string): number {
  if (!str1 && !str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  const s1 = str1.toLowerCase().replace(/[^\w\s]/g, "").trim();
  const s2 = str2.toLowerCase().replace(/[^\w\s]/g, "").trim();

  if (s1 === s2) return 1.0;

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let intersection = 0;
  set1.forEach((w) => {
    if (set2.has(w)) intersection++;
  });

  const union = new Set([...words1, ...words2]).size;
  return union === 0 ? 1.0 : intersection / union;
}

export function computeDeterministicDiff(
  payloadA: ProcessedDocumentPayload,
  payloadB: ProcessedDocumentPayload
): DeterministicDiffResult {
  const chunksA = payloadA.chunks || [];
  const chunksB = payloadB.chunks || [];

  const diffs: DeterministicDiffChunk[] = [];
  const matchedBChunkIds = new Set<string>();

  let modifiedCount = 0;
  let unchangedCount = 0;
  let removedCount = 0;

  // 1. Iterate through Document A chunks and compare against Document B using for...of
  for (const chunkA of chunksA) {
    let bestMatchChunk: typeof chunkA | null = null;
    let bestMatchSim = -1;

    for (const chunkB of chunksB) {
      if (matchedBChunkIds.has(chunkB.id)) continue;
      const sim = calculateTextSimilarity(chunkA.text, chunkB.text);
      if (sim > bestMatchSim) {
        bestMatchSim = sim;
        bestMatchChunk = chunkB;
      }
    }

    if (bestMatchChunk && bestMatchSim >= 0.85) {
      matchedBChunkIds.add(bestMatchChunk.id);
      unchangedCount++;
      diffs.push({
        id: `diff_unchanged_${chunkA.id}_${bestMatchChunk.id}`,
        changeType: "unchanged",
        originalChunkId: chunkA.id,
        newChunkId: bestMatchChunk.id,
        originalText: chunkA.text,
        newText: bestMatchChunk.text,
        originalPage: chunkA.pageNumber,
        newPage: bestMatchChunk.pageNumber,
        originalHeading: chunkA.heading,
        newHeading: bestMatchChunk.heading,
      });
    } else if (bestMatchChunk && bestMatchSim >= 0.35) {
      matchedBChunkIds.add(bestMatchChunk.id);
      modifiedCount++;
      diffs.push({
        id: `diff_modified_${chunkA.id}_${bestMatchChunk.id}`,
        changeType: "modified",
        originalChunkId: chunkA.id,
        newChunkId: bestMatchChunk.id,
        originalText: chunkA.text,
        newText: bestMatchChunk.text,
        originalPage: chunkA.pageNumber,
        newPage: bestMatchChunk.pageNumber,
        originalHeading: chunkA.heading,
        newHeading: bestMatchChunk.heading,
      });
    } else {
      removedCount++;
      diffs.push({
        id: `diff_removed_${chunkA.id}`,
        changeType: "removed",
        originalChunkId: chunkA.id,
        originalText: chunkA.text,
        originalPage: chunkA.pageNumber,
        originalHeading: chunkA.heading,
      });
    }
  }

  // 2. Identify remaining Document B chunks as Added
  let addedCount = 0;
  for (const chunkB of chunksB) {
    if (!matchedBChunkIds.has(chunkB.id)) {
      addedCount++;
      diffs.push({
        id: `diff_added_${chunkB.id}`,
        changeType: "added",
        newChunkId: chunkB.id,
        newText: chunkB.text,
        newPage: chunkB.pageNumber,
        newHeading: chunkB.heading,
      });
    }
  }

  return {
    documentAId: payloadA.documentId,
    documentAName: payloadA.filename,
    documentBId: payloadB.documentId,
    documentBName: payloadB.filename,
    totalChunksA: chunksA.length,
    totalChunksB: chunksB.length,
    addedChunksCount: addedCount,
    removedChunksCount: removedCount,
    modifiedChunksCount: modifiedCount,
    unchangedChunksCount: unchangedCount,
    diffs,
  };
}
