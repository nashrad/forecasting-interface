import { useRef } from 'react';
import { Download, FlaskConical, FilePlus } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useFunnelStore } from './store/funnelStore';
import { StepNav } from './components/steps/StepNav';
import { Step1Structure } from './components/steps/Step1Structure';
import { Step2Labels } from './components/steps/Step2Labels';
import { Step3Numbers } from './components/steps/Step3Numbers';
import { FunnelDiagram } from './components/diagram/FunnelDiagram';
import { CascadeWarningModal } from './components/shared/CascadeWarningModal';
import { LayerInfoModal } from './components/shared/LayerInfoModal';
import { RoutingPanel } from './components/shared/RoutingPanel';
import { ScenarioSidebar } from './components/shared/ScenarioSidebar';

export default function App() {
  const { activeConfig, activeStep, resetToBlank } = useFunnelStore();
  const config = activeConfig();
  const step = activeStep;
  const diagramRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const handleExport = async () => {
    if (!diagramRef.current) return;
    try {
      const dataUrl = await toPng(diagramRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${config.diseaseArea.replace(/\s+/g, '-')}-funnel.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      console.error('Export failed');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 leading-none">PharmaForecast</div>
            <div className="text-[10px] text-slate-400 leading-none mt-0.5">Universal Forecast Model</div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-medium text-slate-700 truncate">{config.diseaseArea}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {config.name}
          </div>

          <button
            onClick={resetToBlank}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            New blank
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#1E3A5F] hover:bg-[#162d4a] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export PNG
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left panel */}
        <aside className="w-80 flex-shrink-0 bg-[#1E3A5F] flex flex-col overflow-hidden shadow-xl">
          <StepNav />
          <div className="h-px bg-white/10" />

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {step === 1 && <Step1Structure />}
            {step === 2 && <Step2Labels />}
            {step === 3 && <Step3Numbers />}
          </div>

          <RoutingPanel />
        </aside>

        {/* Diagram canvas */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="min-h-full p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[calc(100vh-10rem)]">
              <FunnelDiagram diagramRef={diagramRef} />
            </div>
          </div>
        </main>

        {/* Scenario sidebar (right) */}
        <ScenarioSidebar />
      </div>

      <CascadeWarningModal />
      <LayerInfoModal />
    </div>
  );
}
