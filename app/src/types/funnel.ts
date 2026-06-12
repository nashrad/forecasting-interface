export type PoolModel = 'prevalence' | 'incidence' | 'both';
export type PipelineStage = 'Phase I' | 'Phase II' | 'Phase III' | 'Pre-registration';
export type SegmentDimension =
  | 'Biomarker'
  | 'Geography'
  | 'Disease stage'
  | 'Care setting'
  | 'Patient demographics'
  | 'Other';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type ActiveStep = 1 | 2 | 3;

/** Layers that the progressive builder adds/skips one at a time, in this order. */
export type BuildableLayer = 'diagnosis' | 'lot' | 'drugClass' | 'products';

export interface SubSegment {
  id: string;
  label: string;
  rationale?: string;
  diagnosisRate?: number;
  diagnosisRateSource?: string;
}

export interface Segment {
  id: string;
  label: string;
  segmentDimension?: SegmentDimension;
  rationale?: string;
  subSegments: SubSegment[];
  // Step 3 numbers
  diagnosisRate?: number;
  diagnosisRateSource?: string;
  diagnosisRateYear?: number;
  treatmentRate?: number;
  treatmentRateSource?: string;
  treatmentRateYear?: number;
}

export interface LOTLine {
  id: string;
  label: string;
  attritionRate?: number;
  attritionSource?: string;
  subSegments: SubSegment[];
}

export interface DrugClass {
  id: string;
  label: string;
  classShare?: number;
  classShareSource?: string;
  subSegments: SubSegment[];
}

export interface Product {
  id: string;
  label: string;
  type: 'approved' | 'pipeline';
  pipelineStage?: PipelineStage;
  marketShare?: number;
  peakShare?: number;
  timeToPeak?: number;
  shareSource?: string;
  confidence?: ConfidenceLevel;
}

export interface PopulationData {
  prevalence?: number;
  prevalenceSource?: string;
  prevalenceYear?: number;
  incidence?: number;
  incidenceSource?: string;
  incidenceYear?: number;
}

export interface FunnelConfig {
  id: string;
  name: string;
  diseaseArea: string;
  poolModel: PoolModel;
  /** False until the user picks a pool model — gates the whole build flow. */
  poolSet?: boolean;
  population: PopulationData;
  diagnosis: {
    included: boolean;
    segments: Segment[];
  };
  treatment: {
    included: boolean;
  };
  lot: {
    included: boolean;
    lines: LOTLine[];
  };
  drugClass: {
    included: boolean;
    classes: DrugClass[];
  };
  products: {
    included: boolean;
    approved: Product[];
    pipeline: Product[];
  };
  /**
   * Buildable layers that have not yet been decided (added or skipped) in the
   * progressive builder. A layer in this list shows an Add/Skip callout instead
   * of nodes or a ghost. Absent/empty = every layer already decided (default
   * for seeded models).
   */
  pendingLayers?: BuildableLayer[];
}

export interface CascadeWarning {
  title: string;
  affected: string[];
  onConfirm: () => void;
  /** Copy overrides — defaults suit destructive cascades; reversible actions
   *  (e.g. skipping a layer) can soften them. */
  subtitle?: string;
  bodyLabel?: string;
  confirmLabel?: string;
}

// Derived types for the diagram
export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  layer: 'pool' | 'segment' | 'treatment' | 'lot' | 'class' | 'product';
  type?: 'approved' | 'pipeline';
  pipelineStage?: PipelineStage;
  patientCount?: number;
  rate?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiagramEdge {
  id: string;
  sourceId: string;
  targetId: string;
  bypass?: boolean;
}
