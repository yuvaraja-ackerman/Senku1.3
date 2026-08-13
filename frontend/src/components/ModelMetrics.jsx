import React, { useEffect, useState } from 'react';
import { Cpu, BarChart2, CheckSquare, Layers, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ModelMetrics({ backendUrl }) {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/models/info`)
      .then((res) => res.json())
      .then((data) => {
        setModelInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Metrics fetch error:', err);
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center">
        <Cpu className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-300">Loading ML Model Diagnostics...</p>
      </div>
    );
  }

  const txMetrics = modelInfo?.transaction_model?.metrics || {};
  const textMetrics = modelInfo?.text_scam_model?.metrics || {};

  // Transform Feature Importances for Recharts
  const featureData = txMetrics.feature_importance
    ? Object.keys(txMetrics.feature_importance).map((key) => ({
        name: key.replace('_', ' '),
        importance: Math.round(txMetrics.feature_importance[key] * 100)
      })).sort((a, b) => b.importance - a.importance)
    : [];

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Model Card */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-cyan-400 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Transaction Classifier Model
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-500/30">
              RandomForest (100 Trees)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accuracy</span>
              <span className="text-lg font-black text-cyan-400">{(txMetrics.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Precision</span>
              <span className="text-lg font-black text-emerald-400">{(txMetrics.precision * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recall</span>
              <span className="text-lg font-black text-amber-400">{(txMetrics.recall * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">ROC-AUC</span>
              <span className="text-lg font-black text-purple-400">{(txMetrics.roc_auc * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">Confusion Matrix (Validation Set):</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="text-[10px] block opacity-70">True Negatives</span>
                <span className="text-base font-bold">{txMetrics.confusion_matrix?.[0]?.[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
                <span className="text-[10px] block opacity-70">False Positives</span>
                <span className="text-base font-bold">{txMetrics.confusion_matrix?.[0]?.[1]}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
                <span className="text-[10px] block opacity-70">False Negatives</span>
                <span className="text-base font-bold">{txMetrics.confusion_matrix?.[1]?.[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="text-[10px] block opacity-70">True Positives</span>
                <span className="text-base font-bold">{txMetrics.confusion_matrix?.[1]?.[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Phishing Model Card */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-rose-400 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-400" />
              Text & Phishing NLP Model
            </h3>
            <span className="text-xs font-mono text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-500/30">
              TF-IDF + Logistic Reg
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accuracy</span>
              <span className="text-lg font-black text-rose-400">{(textMetrics.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Precision</span>
              <span className="text-lg font-black text-emerald-400">{(textMetrics.precision * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recall</span>
              <span className="text-lg font-black text-amber-400">{(textMetrics.recall * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">ROC-AUC</span>
              <span className="text-lg font-black text-purple-400">{(textMetrics.roc_auc * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">Confusion Matrix (Validation Set):</span>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="text-[10px] block opacity-70">True Negatives</span>
                <span className="text-base font-bold">{textMetrics.confusion_matrix?.[0]?.[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
                <span className="text-[10px] block opacity-70">False Positives</span>
                <span className="text-base font-bold">{textMetrics.confusion_matrix?.[0]?.[1]}</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
                <span className="text-[10px] block opacity-70">False Negatives</span>
                <span className="text-base font-bold">{textMetrics.confusion_matrix?.[1]?.[0]}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                <span className="text-[10px] block opacity-70">True Positives</span>
                <span className="text-base font-bold">{textMetrics.confusion_matrix?.[1]?.[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          Random Forest Feature Importance Weightings (%)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureData} layout="vertical" margin={{ left: 40, right: 20 }}>
              <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 40]} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={130} />
              <Tooltip contentStyle={{ backgroundColor: '#131B2E', borderColor: '#1E293B', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {featureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00F2FE' : index === 1 ? '#4FACFE' : '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
