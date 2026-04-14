'use client';

import { useState, useEffect } from 'react';

interface QuizResultRecord {
  id: string;
  quiz: string;
  name: string;
  organisation: string;
  score: number;
  total: number;
  passed: boolean;
  date: string;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
}

interface Props { onBack: () => void; }

const PASS_PASSWORD = 'KatalonTrue';
const CATS = ['Browser Handling','UI Interaction','Verification','Wait Handling','Frame & Window Handling','Alert Handling','Advanced Keywords','API Testing','Mobile Testing','Desktop Testing','Cross-Platform'];

function esc(s: string) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

export default function AdminScreen({ onBack }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const [results, setResults] = useState<QuizResultRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pw === PASS_PASSWORD) { setAuthed(true); setPwError(false); load(); }
    else { setPwError(true); setPw(''); }
  };

  const load = async () => {
    setLoading(true);
    try { const r = await fetch('/api/results'); const d = await r.json(); setResults(d.results || []); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  const clearAll = async () => {
    if (!confirm('Clear ALL quiz results? This cannot be undone.')) return;
    try { await fetch('/api/results', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: PASS_PASSWORD }) }); }
    catch {}
    load();
  };

  const exportCSV = () => {
    if (!results.length) { alert('No results to export.'); return; }
    const headers = ['#','Quiz','Name','Organisation','Score','Percentage','Passed','Timestamp',...CATS];
    const rows = results.map((r, i) => {
      const pct = Math.round((r.score / r.total) * 100);
      const cats = CATS.map(c => { const d = r.categoryScores?.[c]; return d ? `${d.correct}/${d.total}` : 'N/A'; });
      return [i+1, `"${r.quiz||''}"`, `"${r.name}"`, `"${r.organisation||''}"`, `${r.score}/${r.total}`, `${pct}%`, r.passed?'Yes':'No', r.date, ...cats];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `katalon-quiz-results-${Date.now()}.csv`; a.click();
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '48px 40px', maxWidth: 400, width: '100%', textAlign: 'center', animation: 'slideUp .5s ease both', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent3), var(--accent2))', borderRadius: '20px 20px 0 0' }} />
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin Access</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>Enter the admin password to view trainee results.</p>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="••••••••••••"
            style={{ width: '100%', background: 'var(--surface2)', border: `1.5px solid ${pwError ? 'var(--accent3)' : 'var(--border)'}`, borderRadius: 10, padding: '14px 18px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none', transition: 'border-color .2s', marginBottom: 10, letterSpacing: 3, display: 'block' }}
          />
          {pwError && <div style={{ color: 'var(--accent3)', fontSize: 12, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>Incorrect password. Try again.</div>}
          <button onClick={login} style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent3), #ff8fa3)', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s, transform .15s', letterSpacing: '.5px', marginBottom: 16 }}>
            Enter Dashboard
          </button>
          <span onClick={onBack} style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'color .2s' }}
            onMouseOver={e => (e.target as HTMLElement).style.color = 'var(--accent)'}
            onMouseOut={e => (e.target as HTMLElement).style.color = 'var(--muted)'}
          >← Back to Quiz</span>
        </div>
      </div>
    );
  }

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const avg = total ? Math.round(results.reduce((s, r) => s + Math.round((r.score/r.total)*100), 0) / total) : 0;
  const high = total ? Math.max(...results.map(r => Math.round((r.score/r.total)*100))) : 0;

  const kpis = [
    { label: 'Total Attempts', val: total, sub: 'all time', cls: 'blue' },
    { label: 'Pass Rate', val: `${total ? Math.round((passed/total)*100) : 0}%`, sub: `${passed} of ${total} passed`, cls: 'green' },
    { label: 'Avg Score', val: `${avg}%`, sub: 'pass mark: 75%', cls: 'yellow' },
    { label: 'Top Score', val: `${high}%`, sub: 'best attempt', cls: high >= 75 ? 'green' : 'red' },
  ];

  const kpiColor: Record<string, string> = { green: 'var(--accent)', blue: 'var(--accent2)', red: 'var(--accent3)', yellow: '#ffd166' };
  const kpiBorderColor: Record<string, string> = { green: 'var(--accent)', blue: 'var(--accent2)', red: 'var(--accent3)', yellow: '#ffd166' };

  // Category aggregation
  const agg: Record<string, { correct: number; total: number }> = {};
  CATS.forEach(c => { agg[c] = { correct: 0, total: 0 }; });
  results.forEach(r => { if (r.categoryScores) Object.entries(r.categoryScores).forEach(([c, d]) => { if (agg[c]) { agg[c].correct += d.correct; agg[c].total += d.total; } }); });

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 }}>
            Training <span style={{ color: 'var(--accent3)' }}>Dashboard</span>
          </h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: '⬇ Export CSV', onClick: exportCSV, extra: { borderColor: 'rgba(79,255,176,.3)', color: 'var(--accent)' } },
              { label: '🗑 Clear All', onClick: clearAll, extra: {} },
              { label: '← Back to Quiz', onClick: onBack, extra: {} },
            ].map(btn => (
              <button key={btn.label} onClick={btn.onClick}
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '9px 18px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', transition: 'border-color .2s, color .2s', ...btn.extra }}
                onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = btn.label.includes('Clear') ? 'var(--accent3)' : 'var(--accent)'; el.style.color = btn.label.includes('Clear') ? 'var(--accent3)' : 'var(--accent)'; }}
                onMouseOut={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text)'; }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '8px 0' }}>Loading results...</div>
        ) : (
          <>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14, marginBottom: 28 }}>
              {kpis.map(k => (
                <div key={k.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: kpiBorderColor[k.cls] }} />
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{k.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, lineHeight: 1, color: kpiColor[k.cls] }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Category performance */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              Performance by Category (All Attempts)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12, marginBottom: 28 }}>
              {total === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13, gridColumn: '1/-1', padding: '8px 0' }}>No results yet.</p> : CATS.map(cat => {
                const d = agg[cat]; const p = d.total ? Math.round((d.correct/d.total)*100) : 0;
                const col = p >= 75 ? '#4fffb0' : p >= 50 ? '#ffd166' : '#ff5f87';
                return (
                  <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{cat}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: col }}>{p}%</div>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 4, background: col, width: `${p}%`, transition: 'width 1s cubic-bezier(.4,0,.2,1) .3s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results table */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              All Attempts
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 28, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
                <thead>
                  <tr>
                    {['#','Quiz','Name','Organisation','Score','Result','Date & Time','Weakest Area'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {total === 0 ? (
                    <tr><td colSpan={8}>
                      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
                        <p style={{ fontSize: 14, lineHeight: 1.6 }}>No quiz attempts yet.<br />Results will appear here once trainees complete the quiz.</p>
                      </div>
                    </td></tr>
                  ) : [...results].reverse().map((r, i) => {
                    const pct = Math.round((r.score/r.total)*100);
                    const bc = pct >= 75 ? { bg: 'rgba(79,255,176,.15)', color: 'var(--accent)' } : pct >= 60 ? { bg: 'rgba(255,209,102,.15)', color: '#ffd166' } : { bg: 'rgba(255,95,135,.15)', color: 'var(--accent3)' };
                    const d = new Date(r.date);
                    const ds = d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
                    const ts = d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
                    let weak = '—';
                    if (r.categoryScores) { let mp = Infinity, mc = ''; Object.entries(r.categoryScores).forEach(([c, data]) => { if (data.total > 0) { const p2 = data.correct/data.total; if (p2 < mp) { mp = p2; mc = c; } } }); if (mc) weak = `${mc} (${Math.round(mp*100)}%)`; }
                    return (
                      <tr key={r.id || i} style={{}} onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.02)'} onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{results.length - i}</td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', color: 'var(--accent2)', fontSize: 12 }}>{r.quiz || '—'}</td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12 }}>{r.organisation || '—'}</td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>{r.score}/{r.total} <span style={{ color: 'var(--muted)' }}>({pct}%)</span></td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}><span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, background: bc.bg, color: bc.color }}>{pct >= 75 ? 'PASS' : 'FAIL'}</span></td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{ds} {ts}</td>
                        <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', color: 'var(--accent3)', fontSize: 12 }}>{weak}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
