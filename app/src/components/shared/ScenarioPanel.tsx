import { useState } from 'react';
import { Plus, Check, RotateCcw } from 'lucide-react';
import { useFunnelStore } from '../../store/funnelStore';

export function ScenarioPanel() {
  const { scenarioList, activeScenarioId, switchScenario, addScenario, resetToBlank } = useFunnelStore();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const scenarios = scenarioList();

  const handleAdd = () => {
    if (newName.trim()) {
      addScenario(newName.trim());
      setNewName('');
      setShowNew(false);
    }
  };

  return (
    <div className="px-3 py-3 border-t border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Scenarios</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShowNew(v => !v)}
            title="Save as new variation"
            className="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={resetToBlank}
            title="Start blank"
            className="w-5 h-5 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showNew && (
        <div className="flex gap-1 mb-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Scenario name…"
            className="flex-1 bg-white/10 border border-white/20 rounded-md px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-400/50"
          />
          <button
            onClick={handleAdd}
            className="w-6 h-6 rounded-md bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
          >
            <Check className="w-3 h-3 text-white" />
          </button>
        </div>
      )}

      <div className="space-y-0.5">
        {scenarios.map(sc => (
          <button
            key={sc.id}
            onClick={() => switchScenario(sc.id)}
            className={`
              w-full text-left rounded-md px-2.5 py-1.5 text-xs transition-colors
              ${sc.id === activeScenarioId
                ? 'bg-blue-500/25 text-white font-medium'
                : 'text-white/50 hover:bg-white/8 hover:text-white/80'}
            `}
          >
            {sc.name}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[9px] text-white/20 leading-tight">
        Scenarios persist within this session. Full save/load coming in v1.
      </p>
    </div>
  );
}
