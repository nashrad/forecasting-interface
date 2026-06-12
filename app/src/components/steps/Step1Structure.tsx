import { useFunnelStore } from '../../store/funnelStore';
import type { FunnelConfig } from '../../types/funnel';

function LayerCard({ children, locked }: { children: React.ReactNode; locked?: boolean }) {
  return (
    <div
      className={`mx-3 my-2 rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-opacity ${
        locked ? 'opacity-40 pointer-events-none select-none' : ''
      }`}
      aria-disabled={locked}
    >
      {children}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-3 pt-3 pb-2 border-b border-white/10">
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-sm text-white/80">{label}</span>
      <button
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`
          relative w-10 h-5 rounded-full transition-colors duration-200
          ${value ? 'bg-blue-500' : 'bg-white/20'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`
          absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
          ${value ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </button>
    </div>
  );
}

function CountRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => value > min && onChange(value - 1)}
          disabled={value <= min}
          className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-sm flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold text-white">{value}</span>
        <button
          onClick={() => value < max && onChange(value + 1)}
          disabled={value >= max}
          className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-sm flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

const POOL_OPTIONS: { value: FunnelConfig['poolModel']; label: string; desc: string }[] = [
  { value: 'prevalence', label: 'Prevalence', desc: 'Chronic disease (MS, RA, HIV)' },
  { value: 'incidence', label: 'Incidence', desc: 'Acute / first-diagnosis only' },
  { value: 'both', label: 'Prevalence + Incidence', desc: 'Major chronic with new cases' },
];

export function Step1Structure() {
  const {
    activeConfig,
    setPoolModel,
    setDiagnosisIncluded,
    setSegmentCount,
    setSubSegmentCount,
    setTreatmentIncluded,
    setLotIncluded,
    setLotLineCount,
    setDrugClassIncluded,
    setDrugClassCount,
    setProductsIncluded,
    setApprovedProductCount,
    setPipelineProductCount,
  } = useFunnelStore();

  const config = activeConfig();
  const { diagnosis, treatment, lot, drugClass, products } = config;
  // Until a pool model is chosen, the rest of the structure is locked.
  const locked = !config.poolSet;

  return (
    <div className="flex-1 overflow-y-auto py-2">

      {!locked ? null : (
        <div className="mx-3 mt-2 mb-1 px-3 py-2 rounded-lg bg-blue-500/15 border border-blue-400/30">
          <p className="text-[11px] text-blue-200">
            Choose a patient pool model to begin. The rest unlocks once it's set.
          </p>
        </div>
      )}

      {/* Pool model — always enabled, it's the first step */}
      <LayerCard>
        <SectionHeader label="Patient Pool" />
        <div className="px-3 py-2 space-y-1">
          {POOL_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPoolModel(opt.value)}
              className={`
                w-full text-left rounded-lg px-3 py-2.5 transition-all
                ${config.poolSet && config.poolModel === opt.value
                  ? 'bg-blue-500/25 ring-1 ring-blue-400/50'
                  : 'hover:bg-white/8'}
              `}
            >
              <div className="text-sm font-medium text-white">{opt.label}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </LayerCard>

      {/* Diagnosis */}
      <LayerCard locked={locked}>
        <SectionHeader label="Diagnosis" />
        <ToggleRow label="Include diagnosis layer" value={diagnosis.included} onChange={setDiagnosisIncluded} />
        {diagnosis.included && (
          <>
            <CountRow
              label="Segments"
              value={diagnosis.segments.length}
              min={1} max={5}
              onChange={setSegmentCount}
            />
            {diagnosis.segments.map(seg => (
              <CountRow
                key={seg.id}
                label={`↳ ${seg.label} sub-segments`}
                value={seg.subSegments.length}
                min={0} max={5}
                onChange={v => setSubSegmentCount(seg.id, v)}
              />
            ))}
          </>
        )}
      </LayerCard>

      {/* Treatment */}
      <LayerCard locked={locked}>
        <SectionHeader label="Treatment" />
        <ToggleRow
          label="Include treatment filter"
          value={treatment.included}
          onChange={setTreatmentIncluded}
        />
      </LayerCard>

      {/* LOT */}
      <LayerCard locked={locked}>
        <SectionHeader label="Line of Therapy (LOT)" />
        <ToggleRow label="Include LOT layer" value={lot.included} onChange={setLotIncluded} />
        {lot.included && (
          <CountRow
            label="Lines of therapy"
            value={lot.lines.length}
            min={1} max={5}
            onChange={setLotLineCount}
          />
        )}
        {!lot.included && (
          <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
            <p className="text-[11px] text-amber-300">
              Bypass active — products will connect directly to treatment pool.
            </p>
          </div>
        )}
      </LayerCard>

      {/* Drug Class */}
      <LayerCard locked={locked}>
        <SectionHeader label="Drug Class" />
        <ToggleRow label="Include drug class layer" value={drugClass.included} onChange={setDrugClassIncluded} />
        {drugClass.included && (
          <CountRow
            label="Drug classes"
            value={drugClass.classes.length}
            min={1} max={5}
            onChange={setDrugClassCount}
          />
        )}
        {!drugClass.included && (
          <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
            <p className="text-[11px] text-amber-300">
              Bypass active — products connect directly after LOT.
            </p>
          </div>
        )}
      </LayerCard>

      {/* Products */}
      <LayerCard locked={locked}>
        <SectionHeader label="Products" />
        <ToggleRow label="Include products layer" value={products.included} onChange={setProductsIncluded} />
        {products.included && (
          <>
            <CountRow
              label="Approved products"
              value={products.approved.length}
              min={0} max={8}
              onChange={setApprovedProductCount}
            />
            <CountRow
              label="Pipeline assets"
              value={products.pipeline.length}
              min={0} max={8}
              onChange={setPipelineProductCount}
            />
          </>
        )}
        {!products.included && (
          <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
            <p className="text-[11px] text-amber-300">
              Products skipped — funnel ends at the layer above.
            </p>
          </div>
        )}
      </LayerCard>

      <div className="h-4" />
    </div>
  );
}
