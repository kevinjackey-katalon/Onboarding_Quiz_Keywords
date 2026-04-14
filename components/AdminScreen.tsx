'use client';

import { useState, useEffect } from 'react';

interface QuizResultRecord {
  id: string;
  name: string;
  organisation: string;
  quiz: string;
  score: number;
  total: number;
  passed: boolean;
  date: string;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
}

interface Props {
  onBack: () => void;
}

const PASS_PASSWORD = 'KatalonTrue';

const CATEGORY_COLORS: Record<string, string> = {
  'Configuration': '#818cf8',
  'Locators': '#34d399',
  'Test Creation': '#f59e0b',
  'Debugging': '#f87171',
  'Test Data': '#60a5fa',
  'Test Execution': '#a78bfa',
};

export default function AdminScreen({ onBack }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [results, setResults] = useState<QuizResultRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const handleLogin = () => {
    if (password === PASS_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
      loadResults();
    } else {
      setPasswordError('Incorrect password. Try again.');
    }
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      setResults(data.results || []);
      const cats = new Set<string>();
      for (const r of data.results || []) {
        Object.keys(r.categoryScores || {}).forEach(c => cats.add(c));
      }
      setAllCategories(Array.from(cats));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await fetch('/api/results', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: PASS_PASSWORD }),
      });
      setResults([]);
      setClearConfirm(false);
    } catch {}
  };

  const exportCSV = () => {
    const headers = ['Quiz', 'Name', 'Organisation', 'Score', 'Percentage', 'Result', 'Date', 'Weakest Area', ...allCategories.map(c => `${c} Score`)];
    const rows = results.map(r => {
      const pct = Math.round((r.score / r.total) * 100);
      const catScores = allCategories.map(c => {
        const s = r.categoryScores?.[c];
        return s ? `${s.correct}/${s.total}` : 'N/A';
      });
      return [
        `"${r.quiz || 'Katalon Keywords & Advanced Quiz'}"`,
        `"${r.name}"`,
        `"${r.organisation || ''}"`,
        `${r.score}/${r.total}`,
        `${pct}%`,
        r.passed ? 'Pass' : 'Fail',
        new Date(r.date).toLocaleString(),
        `"${r.weakestCategory}"`,
        ...catScores
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `katalon_quiz_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Category performance across all attempts
  const categoryStats = allCategories.map(cat => {
    let correct = 0, total = 0;
    for (const r of results) {
      const s = r.categoryScores?.[cat];
      if (s) { correct += s.correct; total += s.total; }
    }
    return { cat, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
  });

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Admin Access</h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px' }}>Enter the admin password to view trainee results.</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${passwordError ? '#f87171' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 15, outline: 'none', marginBottom: 8 }}
          />
          {passwordError && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 12px' }}>{passwordError}</p>}
          <button
            onClick={handleLogin}
            style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: 'white', padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}
          >
            Enter Dashboard
          </button>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>← Back to Quiz</button>
        </div>
      </div>
    );
  }

  const passCount = results.filter(r => r.passed).length;
  const avgScore = results.length > 0 ? Math.round(results.reduce((a, r) => a + (r.score / r.total) * 100, 0) / results.length) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>← Back to Quiz</button>
          <h1 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, margin: 0 }}>Training Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={exportCSV} disabled={results.length === 0} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ⬇ Export CSV
          </button>
          <button onClick={() => setClearConfirm(true)} disabled={results.length === 0} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            🗑 Clear All
          </button>
        </div>
      </div>

      {clearConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1a1d2e', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 16, padding: 32, maxWidth: 380, textAlign: 'center' }}>
            <p style={{ color: '#f1f5f9', fontSize: 16, margin: '0 0 20px' }}>Delete all <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''}? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setClearConfirm(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleClear} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>Loading results...</div>
        ) : (
          <>
            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Total Attempts', value: results.length.toString(), color: '#60a5fa' },
                { label: 'Pass Rate', value: results.length > 0 ? `${Math.round((passCount / results.length) * 100)}%` : 'N/A', color: '#34d399' },
                { label: 'Average Score', value: results.length > 0 ? `${avgScore}%` : 'N/A', color: '#f59e0b' },
                { label: 'Passed', value: `${passCount}/${results.length}`, color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Category performance */}
            {results.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
                <h2 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>Performance by Category (All Attempts)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {categoryStats.map(({ cat, correct, total, pct }) => {
                    const color = CATEGORY_COLORS[cat] || '#94a3b8';
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>{cat}</span>
                          <span style={{ color, fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
                        </div>
                        <div style={{ color: '#4a5568', fontSize: 11, marginTop: 4 }}>{correct} of {total} questions correct</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results table */}
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a5568' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                <p>No results yet. Results will appear here after trainees complete the quiz.</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['#', 'Quiz', 'Name', 'Organisation', 'Score', 'Result', 'Date & Time', 'Weakest Area'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, idx) => {
                        const pct = Math.round((r.score / r.total) * 100);
                        return (
                          <tr key={r.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px 16px', color: '#4a5568' }}>{idx + 1}</td>
                            <td style={{ padding: '12px 16px', color: '#60a5fa', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.quiz || 'Katalon Keywords & Advanced Quiz'}</td>
                            <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 600 }}>{r.name}</td>
                            <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{r.organisation || '—'}</td>
                            
                            <td style={{ padding: '12px 16px', color: r.passed ? '#34d399' : '#f87171', fontWeight: 700 }}>{r.score}/{r.total} ({pct}%)</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: r.passed ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', color: r.passed ? '#34d399' : '#f87171' }}>
                                {r.passed ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(r.date).toLocaleString()}</td>
                            <td style={{ padding: '12px 16px', color: '#f59e0b', fontSize: 13 }}>{r.weakestCategory}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
