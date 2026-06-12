import { Layers } from 'lucide-react';

/**
 * Branch 2 (feature/scenario-panel): placeholder only.
 *
 * Reserves the right-hand column for the scenario feature. No CRUD yet —
 * scenario create / name / switch / snapshot logic lands once numbers (Step 3)
 * are in scope. Concept: forecast scenarios with locked structure, varying
 * numbers, user-named. See Resources/branches/feature-scenario-panel.md.
 */
export function ScenarioSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Scenarios</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <Layers className="w-5 h-5 text-slate-300" />
        </div>
        <p className="text-xs font-medium text-slate-500">No scenarios yet</p>
        <p className="text-[11px] text-slate-400 leading-snug mt-1">
          Save variations of this forecast with different numeric assumptions.
          Coming once Step 3 is enabled.
        </p>
      </div>

      <div className="px-4 py-3 border-t border-slate-200">
        <button
          disabled
          className="w-full rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-300 cursor-not-allowed"
        >
          + New scenario
        </button>
      </div>
    </aside>
  );
}
