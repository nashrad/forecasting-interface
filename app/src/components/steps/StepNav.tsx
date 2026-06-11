import { Check } from 'lucide-react';
import { useFunnelStore } from '../../store/funnelStore';

const STEPS = [
  { n: 1, label: 'Structure', desc: 'Shape the funnel' },
  { n: 2, label: 'Labels', desc: 'Define meaning' },
  { n: 3, label: 'Numbers', desc: 'Populate data' },
] as const;

export function StepNav() {
  const { activeStep, setActiveStep } = useFunnelStore();

  return (
    <div className="flex gap-1 p-3">
      {STEPS.map((s, i) => {
        const done = activeStep > s.n;
        const active = activeStep === s.n;
        return (
          <button
            key={s.n}
            onClick={() => setActiveStep(s.n)}
            className={`
              flex-1 rounded-lg px-2 py-2.5 text-left transition-all
              ${active ? 'bg-white/15 ring-1 ring-white/30' : 'hover:bg-white/8'}
            `}
          >
            <div className="flex items-center gap-2">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${done ? 'bg-emerald-400 text-white' : active ? 'bg-white text-navy-900' : 'bg-white/20 text-white/60'}
              `}>
                {done ? <Check className="w-3 h-3" /> : s.n}
              </div>
              <div>
                <div className={`text-xs font-semibold ${active ? 'text-white' : done ? 'text-white/70' : 'text-white/50'}`}>
                  {s.label}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
