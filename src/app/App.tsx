import { useState } from 'react';
import { DashboardView } from './components/DashboardView';
import { ROISimulator } from './components/ROISimulator';
import { ScenarioMode } from './components/ScenarioMode';
import { NegotiationGenerator } from './components/NegotiationGenerator';
import { DualIntelligence } from './components/DualIntelligence';
import { FallbackMode } from './components/FallbackMode';
import { SettingsPage } from './components/SettingsPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LiveIntelligencePanel } from './components/LiveIntelligencePanel';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showIntelligence, setShowIntelligence] = useState(true);

  return (
    <div className="flex h-screen bg-[#0B0F1A] text-white overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} onToggleIntelligence={() => setShowIntelligence(!showIntelligence)} />

        <main className="flex-1 overflow-y-auto scrollbar-custom">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'simulator' && <ROISimulator />}
          {activeView === 'intelligence' && <DualIntelligence />}
          {activeView === 'negotiation' && <NegotiationGenerator />}
          {activeView === 'scenario' && <ScenarioMode />}
          {activeView === 'fallback' && <FallbackMode />}
          {activeView === 'settings' && <SettingsPage />}
        </main>

        <LiveIntelligencePanel isOpen={showIntelligence} onClose={() => setShowIntelligence(false)} />
      </div>
    </div>
  );
}
