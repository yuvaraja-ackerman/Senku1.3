import React, { useState } from 'react';
import { CreditCard, AlertOctagon, CheckCircle2, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export default function TransactionScanner({ backendUrl }) {
  const [formData, setFormData] = useState({
    amount_usd: 1250.00,
    distance_from_home: 120.5,
    velocity_24h: 6,
    hour_of_day: 3,
    is_new_device: 1,
    is_foreign: 1,
    merchant_risk_score: 75.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      name: '✅ Normal Grocery Purchase',
      data: { amount_usd: 42.50, distance_from_home: 2.1, velocity_24h: 1, hour_of_day: 14, is_new_device: 0, is_foreign: 0, merchant_risk_score: 10.0 }
    },
    {
      name: '🚨 High-Risk Offshore Wire',
      data: { amount_usd: 4800.00, distance_from_home: 450.0, velocity_24h: 8, hour_of_day: 2, is_new_device: 1, is_foreign: 1, merchant_risk_score: 85.0 }
    },
    {
      name: '⚡ Midnight Velocity Spike',
      data: { amount_usd: 299.00, distance_from_home: 15.0, velocity_24h: 9, hour_of_day: 3, is_new_device: 1, is_foreign: 0, merchant_risk_score: 65.0 }
    }
  ];

  const handleScan = async (overrideData = null) => {
    const payload = overrideData || formData;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/detect/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetData) => {
    setFormData(presetData);
    handleScan(presetData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Parameters Form */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Financial Transaction Parameter Analyzer
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configure transaction parameters or choose a pre-configured test scenario.</p>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Quick Test Scenarios:</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.data)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-xs font-medium text-slate-300">
          {/* Amount */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Transaction Amount (USD)</span>
              <span className="font-bold text-cyan-400">${formData.amount_usd}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              value={formData.amount_usd}
              onChange={(e) => setFormData({ ...formData, amount_usd: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Distance from Billing Home (Miles)</span>
              <span className="font-bold text-cyan-400">{formData.distance_from_home} miles</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={formData.distance_from_home}
              onChange={(e) => setFormData({ ...formData, distance_from_home: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Velocity 24h */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Velocity (Transactions in last 24h)</span>
              <span className="font-bold text-cyan-400">{formData.velocity_24h} attempts</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={formData.velocity_24h}
              onChange={(e) => setFormData({ ...formData, velocity_24h: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Merchant Risk */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Merchant Category Risk Rating</span>
              <span className="font-bold text-cyan-400">{formData.merchant_risk_score} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.merchant_risk_score}
              onChange={(e) => setFormData({ ...formData, merchant_risk_score: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Hour of Day */}
          <div>
            <div className="flex justify-between mb-1">
              <span>Hour of Transaction (Local Time)</span>
              <span className="font-bold text-cyan-400">{formData.hour_of_day}:00</span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={formData.hour_of_day}
              onChange={(e) => setFormData({ ...formData, hour_of_day: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={formData.is_new_device === 1}
                onChange={(e) => setFormData({ ...formData, is_new_device: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
              <span>Unrecognized Device</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                checked={formData.is_foreign === 1}
                onChange={(e) => setFormData({ ...formData, is_foreign: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
              <span>Foreign / Offshore Wire</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => handleScan()}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          {loading ? (
            <span>Computing Risk Score...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Model Inference</span>
            </>
          )}
        </button>
      </div>

      {/* Inference Output & Explainability */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Model Decision & Explainability Report
          </h3>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
              <Sliders className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No Inference Executed Yet</p>
              <p className="text-xs text-slate-500 mt-1">Adjust parameters or choose a preset test scenario above, then click 'Run Model Inference'.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Gauge Score Banner */}
              <div className={`p-5 rounded-xl border flex items-center justify-between ${
                result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : result.risk_level === 'MEDIUM'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-80">Calculated Fraud Risk</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black">{result.risk_score}</span>
                    <span className="text-sm font-bold opacity-70">/ 100</span>
                  </div>
                  <span className="text-xs mt-1 block">Model Confidence: <span className="font-bold">{result.confidence}%</span></span>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                      ? 'bg-rose-900 text-rose-300 border-rose-400'
                      : result.risk_level === 'MEDIUM'
                      ? 'bg-amber-900 text-amber-300 border-amber-400'
                      : 'bg-emerald-900 text-emerald-300 border-emerald-400'
                  }`}>
                    {result.risk_level} RISK
                  </span>
                  <p className="text-[11px] mt-2 font-semibold">
                    {result.is_fraudulent ? '⚠️ RECOMMENDED ACTION: BLOCK' : '✅ RECOMMENDED ACTION: APPROVE'}
                  </p>
                </div>
              </div>

              {/* Risk Driver SHAP Attribution */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Key Risk Driver Breakdown:</h4>
                {result.risk_factors.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    No significant risk drivers detected for this transaction.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {result.risk_factors.map((factor, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{factor.factor}</span>
                        <span className="font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                          {factor.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Triggered Rules */}
              {result.triggered_rules && result.triggered_rules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Triggered Custom Rules:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.triggered_rules.map((rule, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                        ⚡ {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
