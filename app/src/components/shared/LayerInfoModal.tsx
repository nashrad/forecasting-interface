import { useFunnelStore } from '../../store/funnelStore';
import { layerMeta } from '../../data/layerMeta';

/**
 * Explanatory dialog shown when adding a layer from the progressive builder
 * (unless the user has chosen to skip explanations). Describes what the layer
 * means before committing to it.
 */
export function LayerInfoModal() {
  const {
    layerInfoTarget,
    setLayerInfoTarget,
    addPendingLayer,
    showLayerTips,
    setShowLayerTips,
  } = useFunnelStore();

  if (!layerInfoTarget) return null;
  const meta = layerMeta(layerInfoTarget);

  const confirmAdd = () => {
    addPendingLayer(layerInfoTarget);
    setLayerInfoTarget(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-1">
            Add layer
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{meta.name}</h2>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-slate-600 leading-relaxed">{meta.long}</p>
        </div>

        <div className="px-6 pb-3">
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!showLayerTips}
              onChange={e => setShowLayerTips(!e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Don't show these explanations again
          </label>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={() => setLayerInfoTarget(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmAdd}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#1E3A5F] hover:bg-[#162d4a] transition-colors"
          >
            Add {meta.name} layer
          </button>
        </div>
      </div>
    </div>
  );
}
