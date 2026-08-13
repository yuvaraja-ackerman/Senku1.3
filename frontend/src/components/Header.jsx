import React from 'react';
import { ShieldAlert, Activity, CreditCard, MessageSquare, Globe, Cpu, Sliders, Radio } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Activity },
    { id: 'transaction', label: 'Transaction Scanner', icon: CreditCard },
    { id: 'text', label: 'Phishing & SMS Scanner', icon: MessageSquare },
    { id: 'url', label: 'URL Threat Auditor', icon: Globe },
    { id: 'metrics', label: 'ML Model Intelligence', icon: Cpu },
    { id: 'rules', label: 'Fraud Rules Engine', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                SENTINEL FRAUD SHIELD
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase">
                AI Live Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Multi-Modal Threat & Financial Scam Prevention</p>
          </div>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>MODEL: ONLINE (99.84% ACCURACY)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-4 overflow-x-auto">
        <div className="flex items-center gap-2 border-t border-slate-800/50 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
