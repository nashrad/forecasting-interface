import { useFunnelStore } from '../../store/funnelStore';
import type { Segment } from '../../types/funnel';

const DIMENSIONS: Segment['segmentDimension'][] = [
  'Biomarker', 'Geography', 'Disease stage', 'Care setting', 'Patient demographics', 'Other',
];

function LabelInput({
  label,
  value,
  onChange,
  placeholder,
  small,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  small?: boolean;
}) {
  return (
    <div className="px-4 py-1.5">
      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full bg-white/10 border border-white/15 rounded-lg px-3 text-white placeholder-white/30
          focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60 transition-colors
          ${small ? 'py-1.5 text-xs' : 'py-2 text-sm'}
        `}
      />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function Step2Labels() {
  const {
    activeConfig,
    setDiseaseArea,
    updateSegmentLabel,
    updateSegmentDimension,
    updateSegmentRationale,
    updateSubSegmentLabel,
    updateLotLabel,
    updateClassLabel,
    updateProductLabel,
    updateProductPipelineStage,
  } = useFunnelStore();

  const config = activeConfig();

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Disease area */}
      <SectionHeader label="Model identity" />
      <LabelInput
        label="Disease area"
        value={config.diseaseArea}
        onChange={setDiseaseArea}
        placeholder="e.g. Non-Small Cell Lung Cancer (NSCLC)"
      />

      <div className="h-px bg-white/10 mx-4 my-2" />

      {/* Segments */}
      {config.diagnosis.included && (
        <>
          <SectionHeader label="Diagnosis segments" />
          {config.diagnosis.segments.map((seg, i) => (
            <div key={seg.id} className="mb-3">
              <div className="px-4 py-1">
                <span className="text-xs font-medium text-white/60">Segment {i + 1}</span>
              </div>
              <LabelInput
                label="Label"
                value={seg.label}
                onChange={v => updateSegmentLabel(seg.id, v)}
                placeholder="e.g. EGFR+"
              />
              {/* Dimension picker */}
              <div className="px-4 py-1.5">
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Segmentation dimension</label>
                <div className="flex flex-wrap gap-1.5">
                  {DIMENSIONS.map(dim => (
                    <button
                      key={dim}
                      onClick={() => updateSegmentDimension(seg.id, dim)}
                      className={`
                        px-2 py-1 rounded-md text-[10px] font-medium transition-colors
                        ${seg.segmentDimension === dim
                          ? 'bg-blue-500/30 text-blue-200 ring-1 ring-blue-400/40'
                          : 'bg-white/8 text-white/50 hover:bg-white/15'}
                      `}
                    >
                      {dim}
                    </button>
                  ))}
                </div>
              </div>
              <LabelInput
                label="Clinical rationale (optional)"
                value={seg.rationale ?? ''}
                onChange={v => updateSegmentRationale(seg.id, v)}
                placeholder="Why this segment? Clinical justification…"
                small
              />
              {/* Sub-segments */}
              {seg.subSegments.length > 0 && (
                <div className="mx-4 mt-1 pl-3 border-l border-white/15 space-y-1">
                  {seg.subSegments.map((sub, j) => (
                    <div key={sub.id} className="py-0.5">
                      <label className="block text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
                        Sub-segment {j + 1}
                      </label>
                      <input
                        type="text"
                        value={sub.label}
                        onChange={e => updateSubSegmentLabel(seg.id, sub.id, e.target.value)}
                        placeholder={`Sub-segment ${j + 1}`}
                        className="w-full bg-white/8 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="h-px bg-white/10 mx-4 my-1" />
        </>
      )}

      {/* LOT */}
      {config.lot.included && (
        <>
          <SectionHeader label="Lines of therapy" />
          {config.lot.lines.map((line, i) => (
            <LabelInput
              key={line.id}
              label={`Line ${i + 1}`}
              value={line.label}
              onChange={v => updateLotLabel(line.id, v)}
              placeholder={`e.g. ${i + 1}st Line (${i + 1}L)`}
            />
          ))}
          <div className="h-px bg-white/10 mx-4 my-2" />
        </>
      )}

      {/* Drug classes */}
      {config.drugClass.included && (
        <>
          <SectionHeader label="Drug classes" />
          {config.drugClass.classes.map((cls, i) => (
            <LabelInput
              key={cls.id}
              label={`Class ${i + 1}`}
              value={cls.label}
              onChange={v => updateClassLabel(cls.id, v)}
              placeholder="e.g. PD-1/PD-L1 Checkpoint Inhibitors"
            />
          ))}
          <div className="h-px bg-white/10 mx-4 my-2" />
        </>
      )}

      {/* Products */}
      <SectionHeader label="Approved products" />
      {config.products.approved.map((prod, i) => (
        <LabelInput
          key={prod.id}
          label={`Product ${i + 1}`}
          value={prod.label}
          onChange={v => updateProductLabel(prod.id, v)}
          placeholder="e.g. Pembrolizumab (Keytruda)"
        />
      ))}

      {config.products.pipeline.length > 0 && (
        <>
          <div className="h-px bg-white/10 mx-4 my-2" />
          <SectionHeader label="Pipeline assets" />
          {config.products.pipeline.map((prod, i) => (
            <div key={prod.id} className="mb-2">
              <LabelInput
                label={`Pipeline ${i + 1}`}
                value={prod.label}
                onChange={v => updateProductLabel(prod.id, v)}
                placeholder="e.g. Novel EGFR Bispecific"
              />
              <div className="px-4 py-1">
                <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">Development stage</label>
                <div className="flex gap-1.5 flex-wrap">
                  {(['Phase I', 'Phase II', 'Phase III', 'Pre-registration'] as const).map(stage => (
                    <button
                      key={stage}
                      onClick={() => updateProductPipelineStage(prod.id, stage)}
                      className={`
                        px-2 py-1 rounded-md text-[10px] font-medium transition-colors
                        ${prod.pipelineStage === stage
                          ? 'bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/40'
                          : 'bg-white/8 text-white/50 hover:bg-white/15'}
                      `}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="h-6" />
    </div>
  );
}
