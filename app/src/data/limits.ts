/** Shared node-count limits so the config panel and the canvas agree. */
export const LIMITS = {
  segments: 5,
  subSegments: 5,
  treatment: 5,
  lot: 5,
  drugClass: 5,
  products: 8,
} as const;

/** No layer can be emptied below this from node controls — skip the layer to remove it. */
export const MIN_NODES = 1;
