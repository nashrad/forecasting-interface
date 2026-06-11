import { AlertTriangle, X } from 'lucide-react';
import { useFunnelStore } from '../../store/funnelStore';

export function CascadeWarningModal() {
  const { pendingWarning, setPendingWarning } = useFunnelStore();
  if (!pendingWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-amber-50 px-6 py-5 border-b border-amber-100 flex items-start gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base">{pendingWarning.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">This change cannot be undone.</p>
          </div>
          <button
            onClick={() => setPendingWarning(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm font-medium text-gray-700 mb-3">The following will be lost:</p>
          <ul className="space-y-2">
            {pendingWarning.affected.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => setPendingWarning(null)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={pendingWarning.onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
}
