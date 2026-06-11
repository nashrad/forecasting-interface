import { useFunnelStore } from '../../store/funnelStore';
import { computePatientCounts, formatPatientCount } from '../../utils/calculations';

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function NumberRow({
  label,
  value,
  onChange,
  suffix,
  sourceValue,
  onSourceChange,
  isPercent,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  suffix?: string;
  sourceValue?: string;
  onSourceChange?: (v: string) => void;
  isPercent?: boolean;
}) {
  const display = value !== undefined ? (isPercent ? (value * 100).toFixed(0) : value.toLocaleString()) : '';

  return (
    <div className="px-4 py-1.5">
      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            value={display}
            onChange={e => {
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) onChange(isPercent ? n / 100 : n);
            }}
            className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60 transition-colors"
            placeholder="0"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {onSourceChange && (
          <input
            type="text"
            value={sourceValue ?? ''}
            onChange={e => onSourceChange(e.target.value)}
            placeholder="Source"
            className="w-24 bg-white/8 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/60 placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-blue-400/40"
          />
        )}
      </div>
    </div>
  );
}

function PatientBadge({ count }: { count: number | undefined }) {
  if (!count) return null;
  return (
    <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
      ≈ {formatPatientCount(count)} pts
    </span>
  );
}

export function Step3Numbers() {
  const {
    activeConfig,
    setPopulation,
    updateSegmentRate,
    updateLotAttrition,
    updateClassShare,
    updateProductShare,
  } = useFunnelStore();

  const config = activeConfig();
  const counts = computePatientCounts(config);

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Population */}
      <SectionHeader label="Total population" />
      <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="text-xs text-blue-200 font-semibold">
          Pool total: {formatPatientCount(counts['pool'] ?? 0)} patients
        </div>
        <div className="text-[10px] text-blue-200/60 mt-0.5">
          Updates live as you enter values below
        </div>
      </div>

      {(config.poolModel === 'prevalence' || config.poolModel === 'both') && (
        <NumberRow
          label="Prevalence"
          value={config.population.prevalence}
          onChange={v => setPopulation('prevalence', v)}
          suffix="pts"
          sourceValue={config.population.prevalenceSource}
          onSourceChange={v => setPopulation('prevalenceSource', v)}
        />
      )}
      {(config.poolModel === 'incidence' || config.poolModel === 'both') && (
        <NumberRow
          label="Annual incidence"
          value={config.population.incidence}
          onChange={v => setPopulation('incidence', v)}
          suffix="pts/yr"
          sourceValue={config.population.incidenceSource}
          onSourceChange={v => setPopulation('incidenceSource', v)}
        />
      )}

      <div className="h-px bg-white/10 mx-4 my-2" />

      {/* Diagnosis rates */}
      {config.diagnosis.included && (
        <>
          <SectionHeader label="Diagnosis rates" />
          {config.diagnosis.segments.map(seg => (
            <div key={seg.id} className="mb-2">
              <div className="px-4 pt-1 flex items-center">
                <span className="text-xs font-medium text-white/60">{seg.label}</span>
                <PatientBadge count={counts[`diag-${seg.id}`]} />
              </div>
              <NumberRow
                label="Diagnosis rate"
                value={seg.diagnosisRate}
                onChange={v => updateSegmentRate(seg.id, 'diagnosisRate', v)}
                suffix="%"
                sourceValue={seg.diagnosisRateSource}
                onSourceChange={v => updateSegmentRate(seg.id, 'diagnosisRateSource', v)}
                isPercent
              />
              {config.treatment.included && (
                <NumberRow
                  label="Treatment rate"
                  value={seg.treatmentRate}
                  onChange={v => updateSegmentRate(seg.id, 'treatmentRate', v)}
                  suffix="%"
                  sourceValue={seg.treatmentRateSource}
                  onSourceChange={v => updateSegmentRate(seg.id, 'treatmentRateSource', v)}
                  isPercent
                />
              )}
            </div>
          ))}
          <div className="h-px bg-white/10 mx-4 my-1" />
        </>
      )}

      {/* LOT attrition */}
      {config.lot.included && (
        <>
          <SectionHeader label="LOT attrition" />
          {config.lot.lines.map((line, i) => (
            <div key={line.id} className="flex items-center justify-between px-4 py-1.5">
              <div>
                <span className="text-sm text-white/80">{line.label}</span>
                <PatientBadge count={counts[`lot-${line.id}`]} />
              </div>
              {i > 0 && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0} max={100}
                    value={((line.attritionRate ?? 0.5) * 100).toFixed(0)}
                    onChange={e => updateLotAttrition(line.id, parseFloat(e.target.value) / 100)}
                    className="w-16 bg-white/10 border border-white/15 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-400/60"
                  />
                  <span className="text-xs text-white/40">%</span>
                </div>
              )}
              {i === 0 && <span className="text-xs text-white/30 italic">Entry line</span>}
            </div>
          ))}
          <div className="h-px bg-white/10 mx-4 my-1" />
        </>
      )}

      {/* Drug class shares */}
      {config.drugClass.included && (
        <>
          <SectionHeader label="Drug class market share" />
          {config.drugClass.classes.map(cls => (
            <div key={cls.id} className="flex items-center justify-between px-4 py-1.5">
              <div>
                <span className="text-sm text-white/80 line-clamp-1 max-w-[140px]">{cls.label}</span>
                <PatientBadge count={counts[`class-${cls.id}`]} />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0} max={100}
                  value={((cls.classShare ?? 0) * 100).toFixed(0)}
                  onChange={e => updateClassShare(cls.id, parseFloat(e.target.value) / 100)}
                  className="w-16 bg-white/10 border border-white/15 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-400/60"
                />
                <span className="text-xs text-white/40">%</span>
              </div>
            </div>
          ))}
          <div className="h-px bg-white/10 mx-4 my-1" />
        </>
      )}

      {/* Product shares */}
      <SectionHeader label="Product market share" />
      {config.products.approved.map(prod => (
        <div key={prod.id} className="flex items-center justify-between px-4 py-1.5">
          <div>
            <span className="text-sm text-white/80 line-clamp-1 max-w-[140px]">{prod.label}</span>
            <PatientBadge count={counts[`prod-${prod.id}`]} />
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0} max={100}
              value={((prod.marketShare ?? 0) * 100).toFixed(0)}
              onChange={e => updateProductShare(prod.id, parseFloat(e.target.value) / 100)}
              className="w-16 bg-white/10 border border-white/15 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-400/60"
            />
            <span className="text-xs text-white/40">%</span>
          </div>
        </div>
      ))}

      {config.products.pipeline.length > 0 && (
        <>
          <div className="h-px bg-white/10 mx-4 my-1" />
          <SectionHeader label="Pipeline peak share" />
          {config.products.pipeline.map(prod => (
            <div key={prod.id} className="flex items-center justify-between px-4 py-1.5">
              <div>
                <div className="text-sm text-white/80 line-clamp-1 max-w-[140px]">{prod.label}</div>
                <div className="text-[10px] text-amber-300/70">{prod.pipelineStage}</div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0} max={100}
                  value={((prod.peakShare ?? 0) * 100).toFixed(0)}
                  onChange={e => updateProductShare(prod.id, parseFloat(e.target.value) / 100)}
                  className="w-16 bg-white/10 border border-white/15 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:ring-1 focus:ring-blue-400/60"
                />
                <span className="text-xs text-white/40">%</span>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="h-6" />
    </div>
  );
}
