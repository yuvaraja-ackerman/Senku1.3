import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Check, X, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';

export default function RulesEngine({ backendUrl }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/rules`)
      .then((res) => res.json())
      .then((data) => {
        setRules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Rules fetch error:', err);
        setLoading(false);
      });
  }, [backendUrl]);

  const toggleRule = async (rule) => {
    const updated = { ...rule, enabled: !rule.enabled };
    try {
      const res = await fetch(`${backendUrl}/api/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setRules(rules.map((r) => (r.id === rule.id ? updated : r)));
      }
    } catch (err) {
      console.error('Failed to update rule:', err);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Custom Fraud Prevention Rules Engine
          </h3>
          <p className="text-xs text-slate-400 mt-1">Configure heuristic safety overrides and risk score penalties applied on top of ML models.</p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-semibold">Loading Active Rules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.enabled
                  ? 'bg-slate-900/80 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${rule.enabled ? 'text-amber-400' : 'text-slate-500'}`} />
                  {rule.name}
                </h4>
                <button
                  onClick={() => toggleRule(rule)}
                  className="text-xs font-semibold focus:outline-none"
                >
                  {rule.enabled ? (
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <ToggleRight className="w-4 h-4" /> ENABLED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                      <ToggleLeft className="w-4 h-4" /> DISABLED
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 text-xs space-y-1 text-slate-300 font-mono">
                <p>Target Field: <span className="text-cyan-400 font-bold">{rule.field}</span></p>
                <p>Condition: <span className="text-amber-400 font-bold">{rule.condition} {String(rule.value)}</span></p>
                <p>Risk Score Penalty: <span className="text-rose-400 font-bold">+{rule.risk_addition} points</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
