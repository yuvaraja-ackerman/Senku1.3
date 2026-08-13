import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp, Zap, ArrowRight, Lock, MapPin, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard({ setActiveTab, analyticsData }) {
  const stats = [
    { title: 'Total Scans Analyzed', value: analyticsData?.total_scans?.toLocaleString() || '142,850', change: '+14.2%', icon: Zap, color: 'from-blue-500 to-cyan-500' },
    { title: 'Frauds & Scams Blocked', value: analyticsData?.frauds_blocked?.toLocaleString() || '12,840', change: '+8.9%', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
    { title: 'Threat Catch Rate', value: `${analyticsData?.fraud_rate_pct || 8.99}%`, change: 'Optimal', icon: ShieldAlert, color: 'from-pink-500 to-rose-500' },
    { title: 'Estimated Loss Saved', value: '$4.28M', change: 'This Month', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
  ];

  const pieData = [
    { name: 'Financial Fraud', value: 5420, color: '#FF2E93' },
    { name: 'SMS Smishing', value: 3890, color: '#00F2FE' },
    { name: 'URL Impersonation', value: 3800, color: '#FFC857' },
    { name: 'Crypto Giveaway', value: 1430, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${item.color} text-black font-bold`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black tracking-tight text-white">{item.value}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
                    {item.change}
                  </span>
                  <span className="text-xs text-slate-400">vs previous period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Row: Threat Distribution + Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Distribution Chart */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                Threat Vector Distribution
              </h3>
              <span className="text-xs text-slate-400">Real-time Classification</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131B2E', borderColor: '#1E293B', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">Insight:</span> Credit card transaction fraud and Smishing account for 64% of total detected vectors.
          </div>
        </div>

        {/* Live Real-time Threat Stream */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-400" />
              Live Detected Threat Stream
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Threat ID</th>
                  <th className="pb-3">Threat Type</th>
                  <th className="pb-3">Risk Score</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {analyticsData?.recent_threats?.map((threat) => (
                  <tr key={threat.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-mono text-cyan-400 font-bold">{threat.id}</td>
                    <td className="py-3 font-semibold text-white">{threat.type}</td>
                    <td className="py-3">
                      <span className="font-extrabold">{threat.score}</span> / 100
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        threat.level === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}>
                        {threat.level}
                      </span>
                    </td>
                    <td className="py-3 flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {threat.location}
                    </td>
                    <td className="py-3 text-slate-400">{threat.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Launch Tools Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('transaction')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              💳
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Financial Transaction Scanner</h4>
            <p className="text-xs text-slate-400 mt-1">Test credit card transactions for anomaly score, velocity spikes & foreign wire risks.</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-cyan-400">
            <span>Launch Tool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('text')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              💬
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">Phishing & SMS Scam Scanner</h4>
            <p className="text-xs text-slate-400 mt-1">Analyze suspicious SMS, email bodies, and social media DMs using NLP classification.</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-400">
            <span>Launch Tool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('url')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
              🌐
            </div>
            <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">URL & Web Risk Auditor</h4>
            <p className="text-xs text-slate-400 mt-1">Deep-scan links for typosquatting, brand spoofing, suspicious TLDs & SSL security.</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-400">
            <span>Launch Tool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
