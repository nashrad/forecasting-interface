import { useFunnelStore } from '../../store/funnelStore';
import type { FunnelConfig } from '../../types/funnel';

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
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
    <div className="flex items-center justify-between px-4 py-2.5">
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
    <div className="flex items-center justify-between px-4 py-2">
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
    setApprovedProductCount,
    setPipelineProductCount,
  } = useFunnelStore();

  const config = activeConfig();
  const { diagnosis, treatment, lot, drugClass, products } = config;

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Pool model */}
      <SectionHeader label="Patient Pool" />
      <div className="px-4 pb-2 space-y-1">
        {POOL_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setPoolModel(opt.value)}
            className={`
              w-full text-left rounded-lg px-3 py-2.5 transition-all
              ${config.poolModel === opt.value
                ? 'bg-blue-500/25 ring-1 ring-blue-400/50'
                : 'hover:bg-white/8'}
            `}
          >
            <div className="text-sm font-medium text-white">{opt.label}</div>
            <div className="text-[11px] text-white/50 mt-0.5">{opt.desc}</div>
          </button>
        ))}
      </div>

      <div className="h-px bg-white/10 mx-4 my-1" />

      {/* Diagnosis */}
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

      <div className="h-px bg-white/10 mx-4 my-1" />

      {/* Treatment */}
      <SectionHeader label="Treatment" />
      <ToggleRow
        label="Include treatment filter"
        value={treatment.included}
        onChange={setTreatmentIncluded}
      />

      <div className="h-px bg-white/10 mx-4 my-1" />

      {/* LOT */}
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
        <div className="mx-4 my-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
          <p className="text-[11px] text-amber-300">
            Bypass active — products will connect directly to treatment pool.
          </p>
        </div>
      )}

      <div className="h-px bg-white/10 mx-4 my-1" />

      {/* Drug Class */}
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
        <div className="mx-4 my-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
          <p className="text-[11px] text-amber-300">
            Bypass active — products connect directly after LOT.
          </p>
        </div>
      )}

      <div className="h-px bg-white/10 mx-4 my-1" />

      {/* Products */}
      <SectionHeader label="Products" />
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

      <div className="h-6" />
    </div>
  );
}
