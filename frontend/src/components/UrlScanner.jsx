import React, { useState } from 'react';
import { Globe, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';

export default function UrlScanner({ backendUrl }) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: '🚨 Fake PayPal Typosquat',
      url: 'http://paypal-security-login-update.xyz/auth'
    },
    {
      label: '🚨 Suspicious Bank Verification',
      url: 'http://wellsfargo-identity-verify.top/account'
    },
    {
      label: '🚨 Fake Netflix Billing Update',
      url: 'http://netflix-billing-update.info/login'
    },
    {
      label: '✅ Authentic Domain (GitHub)',
      url: 'https://github.com'
    }
  ];

  const handleScan = async (overrideUrl = null) => {
    const targetUrl = overrideUrl !== null ? overrideUrl : urlInput;
    if (!targetUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/detect/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetUrl) => {
    setUrlInput(presetUrl);
    handleScan(presetUrl);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            URL & Web Domain Security Auditor
          </h3>
          <p className="text-xs text-slate-400 mt-1">Audit web domains for typosquatting, brand spoofing, suspicious TLDs & protocol security.</p>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Preset Domain Targets:</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.url)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste URL (e.g. http://secure-bank-login.xyz)"
            className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <button
          onClick={() => handleScan()}
          disabled={loading || !urlInput.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? (
            <span>Auditing Domain Structure...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Domain Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Audit Output */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Security Audit Results
          </h3>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
              <Globe className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No Domain Audited Yet</p>
              <p className="text-xs text-slate-500 mt-1">Enter a URL or click one of the preset targets to run domain security checks.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Risk Level Banner */}
              <div className={`p-5 rounded-xl border flex items-center justify-between ${
                result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : result.risk_level === 'MEDIUM'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Domain Risk Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black">{result.risk_score}</span>
                    <span className="text-sm font-bold opacity-70">/ 100</span>
                  </div>
                  <span className="text-xs mt-1 block font-mono text-slate-300 truncate max-w-xs">{result.domain}</span>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                      ? 'bg-rose-900 text-rose-300 border-rose-400'
                      : result.risk_level === 'MEDIUM'
                      ? 'bg-amber-900 text-amber-300 border-amber-400'
                      : 'bg-emerald-900 text-emerald-300 border-emerald-400'
                  }`}>
                    {result.risk_level} MALICIOUS
                  </span>
                  <p className="text-[11px] mt-2 font-semibold">
                    {result.is_malicious ? '⚠️ UNTRUSTED DOMAIN' : '✅ SAFE DOMAIN'}
                  </p>
                </div>
              </div>

              {/* Audit Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Audit Check Matrix:</h4>
                <div className="space-y-2">
                  {result.audit_checks.map((check, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {check.status === 'PASS' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : check.status === 'FAIL' ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-semibold text-slate-200 block">{check.title}</span>
                          <span className="text-[11px] text-slate-400">{check.detail}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        check.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
