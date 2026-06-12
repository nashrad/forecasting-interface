import type { BuildableLayer } from '../types/funnel';

export interface LayerMeta {
  key: BuildableLayer;
  name: string;
  /** One line shown in the in-canvas Add/Skip callout. */
  short: string;
  /** Fuller explanation shown in the Add-layer dialog. */
  long: string;
}

/** Order matters — this is the sequence the progressive builder walks through. */
export const BUILDABLE_LAYERS: LayerMeta[] = [
  {
    key: 'diagnosis',
    name: 'Diagnosis',
    short: 'Split the pool into diagnosed segments (e.g. by biomarker or stage).',
    long: 'The Diagnosis layer divides your patient pool into segments — typically by biomarker, disease stage, or another clinical dimension. Each segment can be sized independently and carries its own diagnosis and treatment rates. Add this if your forecast distinguishes between patient groups before treatment.',
  },
  {
    key: 'lot',
    name: 'Line of Therapy',
    short: 'Sequence patients through treatment lines (1L, 2L, 3L+).',
    long: 'The Line of Therapy layer models treatment sequence by intensity. 1L holds the most patients; each subsequent line carries fewer as patients drop off (attrition). Add this if your forecast tracks how patients move through successive treatment lines. Skipping it routes patients directly to drug class or products.',
  },
  {
    key: 'drugClass',
    name: 'Drug Class',
    short: 'Group products by mechanism of action (e.g. checkpoint inhibitors).',
    long: 'The Drug Class layer groups therapies by mechanism of action (e.g. PD-1/PD-L1 inhibitors, TKIs, chemotherapy) and assigns each a share of treated patients. Add this if your forecast allocates patients across drug classes before individual products. Skipping it connects products directly after the line of therapy.',
  },
];

export const layerMeta = (key: BuildableLayer): LayerMeta =>
  BUILDABLE_LAYERS.find(l => l.key === key)!;
