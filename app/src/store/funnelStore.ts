import { create } from 'zustand';
import type { FunnelConfig, ActiveStep, CascadeWarning, Segment, LOTLine, DrugClass, Product, BuildableLayer } from '../types/funnel';
import { nsclcSeed, emptyConfig } from '../data/nsclcSeed';
import { LIMITS } from '../data/limits';

const rid = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface ScenarioMeta {
  id: string;
  name: string;
}

interface FunnelStore {
  // Scenarios (mocked persistence — in-memory only)
  scenarios: FunnelConfig[];
  activeScenarioId: string;

  // Navigation
  activeStep: ActiveStep;
  setActiveStep: (step: ActiveStep) => void;

  // Cascade warning
  pendingWarning: CascadeWarning | null;
  setPendingWarning: (warning: CascadeWarning | null) => void;

  // Progressive layer builder
  showLayerTips: boolean;
  setShowLayerTips: (show: boolean) => void;
  layerInfoTarget: BuildableLayer | null;
  setLayerInfoTarget: (layer: BuildableLayer | null) => void;
  addPendingLayer: (layer: BuildableLayer) => void;
  skipPendingLayer: (layer: BuildableLayer) => void;

  // Scenario management
  activeConfig: () => FunnelConfig;
  switchScenario: (id: string) => void;
  addScenario: (name: string) => void;
  renameScenario: (id: string, name: string) => void;
  resetToBlank: () => void;
  scenarioList: () => ScenarioMeta[];

  // Step 1 — structural changes
  setPoolModel: (model: FunnelConfig['poolModel']) => void;
  setDiagnosisIncluded: (included: boolean) => void;
  setSegmentCount: (count: number) => void;
  setSubSegmentCount: (segmentId: string, count: number) => void;
  addSegment: () => void;
  deleteSegment: (segmentId: string) => void;
  addSubSegment: (segmentId: string) => void;
  deleteSubSegment: (segmentId: string, subId: string) => void;
  setTreatmentIncluded: (included: boolean) => void;
  setTreatmentNodeCount: (count: number) => void;
  addTreatmentNode: () => void;
  deleteTreatmentNode: (nodeId: string) => void;
  setLotIncluded: (included: boolean) => void;
  setLotLineCount: (count: number) => void;
  addLotLine: () => void;
  deleteLotLine: (lotId: string) => void;
  setDrugClassIncluded: (included: boolean) => void;
  setDrugClassCount: (count: number) => void;
  addDrugClass: () => void;
  deleteDrugClass: (classId: string) => void;
  setProductsIncluded: (included: boolean) => void;
  setApprovedProductCount: (count: number) => void;
  setPipelineProductCount: (count: number) => void;
  addProduct: () => void;
  deleteProduct: (productId: string) => void;

  // Step 2 — labelling
  setDiseaseArea: (name: string) => void;
  updateSegmentLabel: (segmentId: string, label: string) => void;
  updateSegmentDimension: (segmentId: string, dim: Segment['segmentDimension']) => void;
  updateSegmentRationale: (segmentId: string, rationale: string) => void;
  updateSubSegmentLabel: (segmentId: string, subId: string, label: string) => void;
  updateLotLabel: (lotId: string, label: string) => void;
  updateClassLabel: (classId: string, label: string) => void;
  updateProductLabel: (productId: string, label: string) => void;
  updateProductPipelineStage: (productId: string, stage: Product['pipelineStage']) => void;

  // Step 3 — numbers
  setPopulation: (field: keyof FunnelConfig['population'], value: number | string) => void;
  updateSegmentRate: (segmentId: string, field: 'diagnosisRate' | 'treatmentRate' | 'diagnosisRateSource' | 'treatmentRateSource', value: number | string) => void;
  updateLotAttrition: (lotId: string, rate: number) => void;
  updateClassShare: (classId: string, share: number) => void;
  updateProductShare: (productId: string, share: number) => void;
}

const updateConfig = (
  store: FunnelStore,
  updater: (config: FunnelConfig) => FunnelConfig
): Partial<FunnelStore> => {
  const updated = store.scenarios.map(s =>
    s.id === store.activeScenarioId ? updater(s) : s
  );
  return { scenarios: updated };
};

const makeSegments = (count: number, existing: Segment[]): Segment[] => {
  const result: Segment[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      existing[i] ?? {
        id: `seg-${Date.now()}-${i}`,
        label: `Segment ${i + 1}`,
        subSegments: [],
      }
    );
  }
  return result;
};

const makeLotLines = (count: number, existing: LOTLine[]): LOTLine[] => {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
  const result: LOTLine[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      existing[i] ?? {
        id: `lot-${Date.now()}-${i}`,
        label: `${ordinals[i]} Line (${i + 1}L)`,
        attritionRate: i === 0 ? 0 : 0.5,
        subSegments: [],
      }
    );
  }
  return result;
};

const makeDrugClasses = (count: number, existing: DrugClass[]): DrugClass[] => {
  const result: DrugClass[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      existing[i] ?? {
        id: `class-${Date.now()}-${i}`,
        label: `Drug Class ${i + 1}`,
        subSegments: [],
      }
    );
  }
  return result;
};

const makeProducts = (
  count: number,
  existing: Product[],
  type: 'approved' | 'pipeline'
): Product[] => {
  const result: Product[] = [];
  for (let i = 0; i < count; i++) {
    result.push(
      existing[i] ?? {
        id: `prod-${type}-${Date.now()}-${i}`,
        label: type === 'approved' ? `Product ${i + 1}` : `Pipeline Asset ${i + 1}`,
        type,
        pipelineStage: type === 'pipeline' ? 'Phase III' : undefined,
      }
    );
  }
  return result;
};

/** A fresh model at the very start of the progressive builder: no pool chosen,
 *  every layer pending. The canvas walks the user through pool → each layer. */
const makeBlankBuild = (): FunnelConfig => ({
  ...JSON.parse(JSON.stringify(emptyConfig)),
  id: `blank-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  name: 'New Model',
  poolSet: false,
  diagnosis: { included: false, segments: [] },
  lot: { included: false, lines: [] },
  drugClass: { included: false, classes: [] },
  products: { included: false, approved: [], pipeline: [] },
  pendingLayers: ['diagnosis', 'lot', 'drugClass', 'products'],
});

const hasLabelsOrNumbers = (config: FunnelConfig): boolean => {
  return config.diagnosis.segments.some(
    s =>
      (s.label && !s.label.startsWith('Segment')) ||
      s.diagnosisRate !== undefined ||
      s.treatmentRate !== undefined ||
      s.subSegments.some(ss => ss.label && !ss.label.startsWith('Sub'))
  );
};

const initialBlank = makeBlankBuild();

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  // Boot into an empty build so the user walks the pool → layer flow. NSCLC is
  // kept as a sample scenario (reachable once scenario switching ships).
  scenarios: [initialBlank, nsclcSeed],
  activeScenarioId: initialBlank.id,
  activeStep: 1,
  pendingWarning: null,
  showLayerTips: true,
  layerInfoTarget: null,

  activeConfig: () =>
    get().scenarios.find(s => s.id === get().activeScenarioId) ?? get().scenarios[0],

  scenarioList: () =>
    get().scenarios.map(s => ({ id: s.id, name: s.name })),

  setActiveStep: step => set({ activeStep: step }),

  setPendingWarning: warning => set({ pendingWarning: warning }),

  switchScenario: id => set({ activeScenarioId: id }),

  addScenario: name => {
    const base = get().activeConfig();
    const newScenario: FunnelConfig = {
      ...JSON.parse(JSON.stringify(base)),
      id: `scenario-${Date.now()}`,
      name,
    };
    set(s => ({ scenarios: [...s.scenarios, newScenario], activeScenarioId: newScenario.id }));
  },

  renameScenario: (id, name) =>
    set(s => ({
      scenarios: s.scenarios.map(sc => sc.id === id ? { ...sc, name } : sc),
    })),

  resetToBlank: () => {
    const blank = makeBlankBuild();
    set(s => ({ scenarios: [...s.scenarios, blank], activeScenarioId: blank.id }));
  },

  setShowLayerTips: show => set({ showLayerTips: show }),
  setLayerInfoTarget: layer => set({ layerInfoTarget: layer }),

  addPendingLayer: layer =>
    set(s => updateConfig(s as FunnelStore, c => {
      const pendingLayers = (c.pendingLayers ?? []).filter(l => l !== layer);
      if (layer === 'diagnosis') {
        return {
          ...c, pendingLayers,
          diagnosis: {
            included: true,
            segments: c.diagnosis.segments.length ? c.diagnosis.segments : makeSegments(1, []),
          },
        };
      }
      if (layer === 'lot') {
        return {
          ...c, pendingLayers,
          lot: {
            included: true,
            lines: c.lot.lines.length ? c.lot.lines : makeLotLines(2, []),
          },
        };
      }
      if (layer === 'products') {
        return {
          ...c, pendingLayers,
          products: {
            included: true,
            approved: c.products.approved.length ? c.products.approved : makeProducts(1, [], 'approved'),
            pipeline: c.products.pipeline,
          },
        };
      }
      return {
        ...c, pendingLayers,
        drugClass: {
          included: true,
          classes: c.drugClass.classes.length ? c.drugClass.classes : makeDrugClasses(1, []),
        },
      };
    })),

  skipPendingLayer: layer =>
    set(s => updateConfig(s as FunnelStore, c => {
      const pendingLayers = (c.pendingLayers ?? []).filter(l => l !== layer);
      if (layer === 'diagnosis') return { ...c, pendingLayers, diagnosis: { ...c.diagnosis, included: false } };
      if (layer === 'lot') return { ...c, pendingLayers, lot: { ...c.lot, included: false } };
      if (layer === 'products') return { ...c, pendingLayers, products: { ...c.products, included: false } };
      return { ...c, pendingLayers, drugClass: { ...c.drugClass, included: false } };
    })),

  // Step 1
  setPoolModel: model =>
    set(s => updateConfig(s as FunnelStore, c => ({ ...c, poolModel: model, poolSet: true }))),

  setDiagnosisIncluded: included =>
    set(s => {
      const config = s.scenarios.find(sc => sc.id === s.activeScenarioId)!;
      const willLoseData = !included && hasLabelsOrNumbers(config);
      if (willLoseData && included === false) {
        s.pendingWarning = {
          title: 'Remove Diagnosis layer?',
          affected: [
            `${config.diagnosis.segments.length} segment(s) and all their labels`,
            'All diagnosis and treatment rates',
            'All sub-segment labels',
          ],
          onConfirm: () => {
            set(st => updateConfig(st as FunnelStore, c => ({
              ...c,
              diagnosis: { ...c.diagnosis, included: false },
            })));
            set({ pendingWarning: null });
          },
        };
        return { pendingWarning: s.pendingWarning };
      }
      return updateConfig(s as FunnelStore, c => ({
        ...c,
        diagnosis: { ...c.diagnosis, included },
      }));
    }),

  setSegmentCount: count =>
    set(s => {
      const config = s.scenarios.find(sc => sc.id === s.activeScenarioId)!;
      const current = config.diagnosis.segments;
      if (count < current.length) {
        const losing = current.slice(count);
        const lostLabels = losing
          .filter(seg => seg.label && !seg.label.startsWith('Segment'))
          .map(seg => `"${seg.label}"`);
        if (lostLabels.length > 0) {
          const warning: CascadeWarning = {
            title: `Reduce to ${count} segment${count !== 1 ? 's' : ''}?`,
            affected: [
              `Segment${lostLabels.length > 1 ? 's' : ''} ${lostLabels.join(', ')} will be removed`,
              'All labels, rates, and sub-segments for those segments will be lost',
            ],
            onConfirm: () => {
              set(st => updateConfig(st as FunnelStore, c => ({
                ...c,
                diagnosis: { ...c.diagnosis, segments: makeSegments(count, c.diagnosis.segments) },
              })));
              set({ pendingWarning: null });
            },
          };
          return { pendingWarning: warning };
        }
      }
      return updateConfig(s as FunnelStore, c => ({
        ...c,
        diagnosis: { ...c.diagnosis, segments: makeSegments(count, c.diagnosis.segments) },
      }));
    }),

  setSubSegmentCount: (segmentId, count) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg => {
          if (seg.id !== segmentId) return seg;
          const current = seg.subSegments;
          const newSubs = [];
          for (let i = 0; i < count; i++) {
            newSubs.push(current[i] ?? {
              id: `sub-${segmentId}-${Date.now()}-${i}`,
              label: `Sub-segment ${i + 1}`,
            });
          }
          return { ...seg, subSegments: newSubs };
        }),
      },
    }))),

  addSegment: () =>
    set(s => updateConfig(s as FunnelStore, c => {
      if (c.diagnosis.segments.length >= LIMITS.segments) return c;
      return {
        ...c,
        diagnosis: {
          ...c.diagnosis,
          segments: [
            ...c.diagnosis.segments,
            {
              id: `seg-${rid()}`,
              label: `Segment ${c.diagnosis.segments.length + 1}`,
              subSegments: [],
            },
          ],
        },
      };
    })),

  deleteSegment: segmentId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.filter(seg => seg.id !== segmentId),
      },
    }))),

  addSubSegment: segmentId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id !== segmentId || seg.subSegments.length >= LIMITS.subSegments ? seg : {
            ...seg,
            subSegments: [
              ...seg.subSegments,
              {
                id: `sub-${segmentId}-${rid()}`,
                label: `Sub-segment ${seg.subSegments.length + 1}`,
              },
            ],
          }
        ),
      },
    }))),

  deleteSubSegment: (segmentId, subId) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id !== segmentId ? seg : {
            ...seg,
            subSegments: seg.subSegments.filter(ss => ss.id !== subId),
          }
        ),
      },
    }))),

  setTreatmentIncluded: included =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      treatment: {
        included,
        nodes: c.treatment.nodes.length ? c.treatment.nodes : [{ id: `treat-${rid()}`, label: 'Treated Patients' }],
      },
    }))),

  setTreatmentNodeCount: count =>
    set(s => updateConfig(s as FunnelStore, c => {
      const existing = c.treatment.nodes;
      const nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push(existing[i] ?? { id: `treat-${rid()}`, label: i === 0 ? 'Treated Patients' : `Treatment ${i + 1}` });
      }
      return { ...c, treatment: { ...c.treatment, nodes } };
    })),

  addTreatmentNode: () =>
    set(s => updateConfig(s as FunnelStore, c => {
      if (c.treatment.nodes.length >= LIMITS.treatment) return c;
      return {
        ...c,
        treatment: {
          ...c.treatment,
          nodes: [...c.treatment.nodes, { id: `treat-${rid()}`, label: `Treatment ${c.treatment.nodes.length + 1}` }],
        },
      };
    })),

  deleteTreatmentNode: nodeId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      treatment: { ...c.treatment, nodes: c.treatment.nodes.filter(n => n.id !== nodeId) },
    }))),

  addLotLine: () =>
    set(s => updateConfig(s as FunnelStore, c => {
      if (c.lot.lines.length >= LIMITS.lot) return c;
      const ordinals = ['1st', '2nd', '3rd', '4th', '5th'];
      const i = c.lot.lines.length;
      return {
        ...c,
        lot: {
          ...c.lot,
          lines: [...c.lot.lines, { id: `lot-${rid()}`, label: `${ordinals[i] ?? `${i + 1}th`} Line (${i + 1}L)`, attritionRate: i === 0 ? 0 : 0.5, subSegments: [] }],
        },
      };
    })),

  deleteLotLine: lotId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      lot: { ...c.lot, lines: c.lot.lines.filter(l => l.id !== lotId) },
    }))),

  addDrugClass: () =>
    set(s => updateConfig(s as FunnelStore, c => {
      if (c.drugClass.classes.length >= LIMITS.drugClass) return c;
      return {
        ...c,
        drugClass: {
          ...c.drugClass,
          classes: [...c.drugClass.classes, { id: `class-${rid()}`, label: `Drug Class ${c.drugClass.classes.length + 1}`, subSegments: [] }],
        },
      };
    })),

  deleteDrugClass: classId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      drugClass: { ...c.drugClass, classes: c.drugClass.classes.filter(cl => cl.id !== classId) },
    }))),

  addProduct: () =>
    set(s => updateConfig(s as FunnelStore, c => {
      const total = c.products.approved.length + c.products.pipeline.length;
      if (total >= LIMITS.products) return c;
      return {
        ...c,
        products: {
          ...c.products,
          approved: [...c.products.approved, { id: `prod-approved-${rid()}`, label: `Product ${c.products.approved.length + 1}`, type: 'approved' }],
        },
      };
    })),

  deleteProduct: productId =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: {
        ...c.products,
        approved: c.products.approved.filter(p => p.id !== productId),
        pipeline: c.products.pipeline.filter(p => p.id !== productId),
      },
    }))),

  setLotIncluded: included =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      lot: { ...c.lot, included },
    }))),

  setLotLineCount: count =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      lot: { ...c.lot, lines: makeLotLines(count, c.lot.lines) },
    }))),

  setDrugClassIncluded: included =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      drugClass: { ...c.drugClass, included },
    }))),

  setDrugClassCount: count =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      drugClass: { ...c.drugClass, classes: makeDrugClasses(count, c.drugClass.classes) },
    }))),

  setProductsIncluded: included =>
    set(s => updateConfig(s as FunnelStore, c => {
      const pendingLayers = (c.pendingLayers ?? []).filter(l => l !== 'products');
      if (included) {
        return {
          ...c, pendingLayers,
          products: {
            included: true,
            approved: c.products.approved.length ? c.products.approved : makeProducts(1, [], 'approved'),
            pipeline: c.products.pipeline,
          },
        };
      }
      return { ...c, pendingLayers, products: { ...c.products, included: false } };
    })),

  setApprovedProductCount: count =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: { ...c.products, approved: makeProducts(count, c.products.approved, 'approved') },
    }))),

  setPipelineProductCount: count =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: { ...c.products, pipeline: makeProducts(count, c.products.pipeline, 'pipeline') },
    }))),

  // Step 2
  setDiseaseArea: name =>
    set(s => updateConfig(s as FunnelStore, c => ({ ...c, diseaseArea: name }))),

  updateSegmentLabel: (segmentId, label) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id === segmentId ? { ...seg, label } : seg
        ),
      },
    }))),

  updateSegmentDimension: (segmentId, dim) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id === segmentId ? { ...seg, segmentDimension: dim } : seg
        ),
      },
    }))),

  updateSegmentRationale: (segmentId, rationale) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id === segmentId ? { ...seg, rationale } : seg
        ),
      },
    }))),

  updateSubSegmentLabel: (segmentId, subId, label) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id !== segmentId
            ? seg
            : {
                ...seg,
                subSegments: seg.subSegments.map(ss =>
                  ss.id === subId ? { ...ss, label } : ss
                ),
              }
        ),
      },
    }))),

  updateLotLabel: (lotId, label) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      lot: {
        ...c.lot,
        lines: c.lot.lines.map(l => l.id === lotId ? { ...l, label } : l),
      },
    }))),

  updateClassLabel: (classId, label) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      drugClass: {
        ...c.drugClass,
        classes: c.drugClass.classes.map(cl => cl.id === classId ? { ...cl, label } : cl),
      },
    }))),

  updateProductLabel: (productId, label) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: {
        ...c.products,
        approved: c.products.approved.map(p => p.id === productId ? { ...p, label } : p),
        pipeline: c.products.pipeline.map(p => p.id === productId ? { ...p, label } : p),
      },
    }))),

  updateProductPipelineStage: (productId, stage) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: {
        ...c.products,
        pipeline: c.products.pipeline.map(p => p.id === productId ? { ...p, pipelineStage: stage } : p),
      },
    }))),

  // Step 3
  setPopulation: (field, value) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      population: { ...c.population, [field]: value },
    }))),

  updateSegmentRate: (segmentId, field, value) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      diagnosis: {
        ...c.diagnosis,
        segments: c.diagnosis.segments.map(seg =>
          seg.id === segmentId ? { ...seg, [field]: value } : seg
        ),
      },
    }))),

  updateLotAttrition: (lotId, rate) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      lot: {
        ...c.lot,
        lines: c.lot.lines.map(l => l.id === lotId ? { ...l, attritionRate: rate } : l),
      },
    }))),

  updateClassShare: (classId, share) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      drugClass: {
        ...c.drugClass,
        classes: c.drugClass.classes.map(cl => cl.id === classId ? { ...cl, classShare: share } : cl),
      },
    }))),

  updateProductShare: (productId, share) =>
    set(s => updateConfig(s as FunnelStore, c => ({
      ...c,
      products: {
        ...c.products,
        approved: c.products.approved.map(p => p.id === productId ? { ...p, marketShare: share } : p),
        pipeline: c.products.pipeline.map(p => p.id === productId ? { ...p, peakShare: share } : p),
      },
    }))),
}));
