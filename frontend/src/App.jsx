import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionScanner from './components/TransactionScanner';
import TextScanner from './components/TextScanner';
import UrlScanner from './components/UrlScanner';
import ModelMetrics from './components/ModelMetrics';
import RulesEngine from './components/RulesEngine';

const BACKEND_URL = '';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/analytics`)
      .then((res) => res.json())
      .then((data) => setAnalyticsData(data))
      .catch((err) => console.error('Analytics fetch error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} analyticsData={analyticsData} />}
        {activeTab === 'transaction' && <TransactionScanner backendUrl={BACKEND_URL} />}
        {activeTab === 'text' && <TextScanner backendUrl={BACKEND_URL} />}
        {activeTab === 'url' && <UrlScanner backendUrl={BACKEND_URL} />}
        {activeTab === 'metrics' && <ModelMetrics backendUrl={BACKEND_URL} />}
        {activeTab === 'rules' && <RulesEngine backendUrl={BACKEND_URL} />}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Fraud Sentinel AI Platform. Autonomous Threat Intelligence System.</span>
          <span className="font-mono text-cyan-400">STATUS: ALL MODELS OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
}
