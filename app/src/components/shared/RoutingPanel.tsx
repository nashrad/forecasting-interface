import { useFunnelStore } from '../../store/funnelStore';

export function RoutingPanel() {
  const { activeConfig } = useFunnelStore();
  const config = activeConfig();
  const { lot, drugClass } = config;

  const lotActive = lot.included;
  const classActive = drugClass.included;

  let routingDesc = '';
  if (lotActive && classActive) routingDesc = 'Full depth';
  else if (lotActive && !classActive) routingDesc = 'LOT → Products (class bypassed)';
  else if (!lotActive && classActive) routingDesc = 'Treatment → Class → Products (LOT bypassed)';
  else routingDesc = 'Treatment → Products (LOT + Class bypassed)';

  const hasBypass = !lotActive || !classActive;

  return (
    <div className="px-3 py-3 border-t border-white/10">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Routing</span>
        {hasBypass && (
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
            BYPASS ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${lotActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-xs text-white/60">
            LOT: <span className={lotActive ? 'text-emerald-400' : 'text-amber-400'}>
              {lotActive ? `${lot.lines.length} line${lot.lines.length !== 1 ? 's' : ''}` : 'Bypassed'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${classActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-xs text-white/60">
            Drug class: <span className={classActive ? 'text-emerald-400' : 'text-amber-400'}>
              {classActive ? `${drugClass.classes.length} class${drugClass.classes.length !== 1 ? 'es' : ''}` : 'Bypassed'}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-white/35 leading-tight">
        {routingDesc}
      </div>
    </div>
  );
}
