import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, ShieldCheck, Sparkles, Tag, AlertCircle } from 'lucide-react';

export default function TextScanner({ backendUrl }) {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    {
      label: '🚨 Bank Lock SMS Phishing',
      text: 'URGENT: Your bank account has been locked due to suspicious activity. Verify identity now at http://secure-bank-login.xyz/auth or lose access forever!'
    },
    {
      label: '🚨 Crypto Double Giveaway Trap',
      text: 'CONGRATULATIONS! You won 1.5 BTC in our giveaway. To release funds, transfer 0.05 BTC processing fee to wallet address 0x94A... immediately!'
    },
    {
      label: '🚨 IRS Lawsuit Warning',
      text: 'FINAL WARNING: Internal Revenue Service tax lawsuit filed against your SSN. Call immediately at 800-555-0199 to settle payment before arrest warrant.'
    },
    {
      label: '✅ Normal Lunch Confirmation',
      text: 'Hey John, are we still meeting for lunch today at 1pm at the downtown cafe? Let me know if you want to invite Sarah as well!'
    }
  ];

  const handleScan = async (overrideText = null) => {
    const text = overrideText !== null ? overrideText : textInput;
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/detect/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetText) => {
    setTextInput(presetText);
    handleScan(presetText);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Area */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-400" />
            Phishing & SMS Scam Text Inspector
          </h3>
          <p className="text-xs text-slate-400 mt-1">Paste suspicious text from emails, SMS messages, WhatsApp, or social media DMs.</p>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Sample Scam Presets:</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.text)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={7}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste suspicious text message or email content here..."
          className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-rose-500/50"
        />

        <button
          onClick={() => handleScan()}
          disabled={loading || !textInput.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 font-bold text-white text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
        >
          {loading ? (
            <span>Analyzing Text Vectors...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Inspect Scam Probability</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Result */}
      <div className="lg:col-span-6 glass-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            NLP Classification & Threat Diagnosis
          </h3>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
              <MessageSquare className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No Text Analyzed Yet</p>
              <p className="text-xs text-slate-500 mt-1">Select a preset or paste custom text above to evaluate phishing indicators.</p>
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
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Phishing / Scam Risk Score</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black">{result.risk_score}</span>
                    <span className="text-sm font-bold opacity-70">/ 100</span>
                  </div>
                  <span className="text-xs mt-1 block">Classifier Confidence: <span className="font-bold">{result.confidence}%</span></span>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH'
                      ? 'bg-rose-900 text-rose-300 border-rose-400'
                      : result.risk_level === 'MEDIUM'
                      ? 'bg-amber-900 text-amber-300 border-amber-400'
                      : 'bg-emerald-900 text-emerald-300 border-emerald-400'
                  }`}>
                    {result.risk_level} SCAM THREAT
                  </span>
                  <p className="text-[11px] mt-2 font-semibold">
                    {result.is_scam ? '⚠️ DO NOT CLICK LINKS OR REPLY' : '✅ MESSAGE APPEARS LEGITIMATE'}
                  </p>
                </div>
              </div>

              {/* Red Flags List */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Detected Threat Indicators:</h4>
                {result.red_flags.length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    No malicious social engineering red flags identified.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {result.red_flags.map((flag, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagged Keywords */}
              {result.flagged_words && result.flagged_words.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    Flagged Phishing Keywords:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.flagged_words.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-500/30 text-xs font-mono">
                        #{kw}
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
