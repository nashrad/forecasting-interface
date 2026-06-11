import type { FunnelConfig } from '../types/funnel';

export function computePatientCounts(config: FunnelConfig): Record<string, number> {
  const counts: Record<string, number> = {};

  const { poolModel, population, diagnosis, treatment, lot, drugClass, products } = config;

  // Total pool
  const prev = population.prevalence ?? 0;
  const inc = population.incidence ?? 0;
  const poolTotal =
    poolModel === 'prevalence' ? prev :
    poolModel === 'incidence' ? inc :
    prev + inc;

  counts['pool'] = poolTotal;

  if (!diagnosis.included || diagnosis.segments.length === 0) return counts;

  // Per-segment patient counts after diagnosis
  const segmentWeight = 1 / diagnosis.segments.length;
  diagnosis.segments.forEach(seg => {
    const segPool = poolTotal * segmentWeight;
    const diagRate = seg.diagnosisRate ?? 0.7;
    const diagnosed = segPool * diagRate;
    counts[`diag-${seg.id}`] = Math.round(diagnosed);

    const treatRate = seg.treatmentRate ?? 0.65;
    const treated = diagnosed * treatRate;
    counts[`treat-${seg.id}`] = Math.round(treated);
  });

  // Aggregate treated pool
  const totalTreated = diagnosis.segments.reduce(
    (sum, seg) => sum + (counts[`treat-${seg.id}`] ?? 0),
    0
  );

  if (!lot.included) {
    // Bypass LOT — go straight to class/products
    counts['lot-bypass'] = totalTreated;
  } else {
    lot.lines.forEach((line, i) => {
      if (i === 0) {
        counts[`lot-${line.id}`] = totalTreated;
      } else {
        const prev = counts[`lot-${lot.lines[i - 1].id}`] ?? totalTreated;
        counts[`lot-${line.id}`] = Math.round(prev * (1 - (line.attritionRate ?? 0.5)));
      }
    });
  }

  // Drug class
  const lotPool = lot.included
    ? lot.lines.reduce((sum, l) => sum + (counts[`lot-${l.id}`] ?? 0), 0)
    : totalTreated;

  if (!drugClass.included) {
    counts['class-bypass'] = lotPool;
  } else {
    const totalShare = drugClass.classes.reduce((s, c) => s + (c.classShare ?? 0), 0) || 1;
    drugClass.classes.forEach(cls => {
      const share = (cls.classShare ?? 0) / totalShare;
      counts[`class-${cls.id}`] = Math.round(lotPool * share);
    });
  }

  // Products
  const productPool = drugClass.included
    ? drugClass.classes.reduce((s, c) => s + (counts[`class-${c.id}`] ?? 0), 0)
    : lotPool;

  const allProducts = [...products.approved, ...products.pipeline];
  const totalShare = allProducts.reduce((s, p) => s + (p.marketShare ?? p.peakShare ?? 0), 0) || 1;
  allProducts.forEach(p => {
    const share = (p.marketShare ?? p.peakShare ?? 0) / totalShare;
    counts[`prod-${p.id}`] = Math.round(productPool * share);
  });

  return counts;
}

export function formatPatientCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
