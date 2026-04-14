'use client';

import { questions } from '@/lib/questions';
import type { QuizResult } from './QuizApp';

interface Props {
  result: QuizResult;
  onRetake: () => void;
  onHome: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Browser Handling': '#60a5fa',
  'UI Interaction': '#f59e0b',
  'Verification': '#34d399',
  'Wait Handling': '#a78bfa',
  'Frame & Window Handling': '#f87171',
  'Alert Handling': '#fb923c',
  'Advanced Keywords': '#e879f9',
  'API Testing': '#38bdf8',
  'Mobile Testing': '#4ade80',
  'Desktop Testing': '#facc15',
  'Cross-Platform': '#94a3b8',
};

export default function ResultsScreen({ result, onRetake, onHome }: Props) {
  const pct = Math.round((result.score / result.total) * 100);

  const getAnswerDisplay = (qIndex: number): { correct: boolean; userAnswer: string; correctAnswer: string } => {
    const q = questions[qIndex];
    const userRaw = result.answers[q.id];

    if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
      const userLetter = userRaw as string | undefined;
      const correctLetter = q.correctLetter || '';
      const userOpt = q.options?.find(o => o.letter === userLetter);
      const correctOpt = q.options?.find(o => o.letter === correctLetter);
      const isCorrect = userLetter === correctLetter;
      return {
        correct: isCorrect,
        userAnswer: userLetter ? `${userLetter}) ${userOpt?.text || ''}` : '(no answer)',
        correctAnswer: `${correctLetter}) ${correctOpt?.text || ''}`,
      };
    }
    if (q.type === 'Fill in the Blank') {
      const user = String(userRaw || '').trim();
      const correct = (q.correctAnswer || '').trim();
      const isCorrect = user.toLowerCase().replace(/['"]/g, '') === correct.toLowerCase().replace(/['"]/g, '');
      return { correct: isCorrect, userAnswer: user || '(no answer)', correctAnswer: correct };
    }
    if (q.type === 'Drag to Order') {
      const userOrder = (userRaw as string[] | undefined) || [];
      const correctOrder = q.orderedSteps || [];
      const isCorrect = userOrder.length === correctOrder.length && userOrder.every((s, i) => s === correctOrder[i]);
      return {
        correct: isCorrect,
        userAnswer: userOrder.length ? userOrder.map((s, i) => `${i + 1}. ${s}`).join('\n') : '(no answer)',
        correctAnswer: correctOrder.map((s, i) => `${i + 1}. ${s}`).join('\n'),
      };
    }
    return { correct: false, userAnswer: '(no answer)', correctAnswer: '' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>← Home</button>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>
        {/* Score card */}
        <div style={{
          background: result.passed ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
          border: `1px solid ${result.passed ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
          borderRadius: 20, padding: '36px 32px', textAlign: 'center', marginBottom: 32,
        }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{result.passed ? '🎉' : '📚'}</div>
          <h1 style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>
            {result.passed ? 'Congratulations!' : 'Keep Practising!'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: '0 0 24px' }}>
            {result.name}{result.organisation ? ` · ${result.organisation}` : ''}
          </p>
          <div style={{ fontSize: 64, fontWeight: 900, color: result.passed ? '#34d399' : '#f87171', lineHeight: 1, marginBottom: 8 }}>{pct}%</div>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: '0 0 24px' }}>
            {result.score} / {result.total} correct
          </p>
          <span style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 20,
            background: result.passed ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)',
            color: result.passed ? '#34d399' : '#f87171',
            fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {result.passed ? '✓ Passed' : '✗ Not Passed'}
          </span>
        </div>

        {/* Category breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: '24px', marginBottom: 32 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Performance by Topic</h2>
          {Object.entries(result.categoryScores).map(([cat, scores]) => {
            const catPct = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
            const color = CATEGORY_COLORS[cat] || '#94a3b8';
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600 }}>{cat}</span>
                  <span style={{ color: color, fontSize: 14, fontWeight: 700 }}>{scores.correct}/{scores.total}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${catPct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}
          {result.weakestCategory && (
            <p style={{ color: '#f59e0b', fontSize: 13, margin: '16px 0 0', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '10px 14px' }}>
              💡 Focus area: <strong>{result.weakestCategory}</strong>
            </p>
          )}
        </div>

        {/* Question review */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: '24px', marginBottom: 32 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Question Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map((q, idx) => {
              const { correct, userAnswer, correctAnswer } = getAnswerDisplay(idx);
              return (
                <div key={q.id} style={{
                  background: correct ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
                  border: `1px solid ${correct ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{correct ? '✅' : '❌'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#cbd5e1', fontSize: 14, margin: '0 0 8px', fontWeight: 500, whiteSpace: 'pre-line' }}>{idx + 1}. {q.question}</p>
                      {!correct && (
                        <div style={{ fontSize: 13 }}>
                          <p style={{ color: '#f87171', margin: '0 0 4px' }}>Your answer: <span style={{ fontFamily: q.type === 'Drag to Order' ? 'inherit' : 'monospace', whiteSpace: 'pre-line' }}>{userAnswer}</span></p>
                          <p style={{ color: '#34d399', margin: 0 }}>Correct: <span style={{ fontFamily: q.type === 'Drag to Order' ? 'inherit' : 'monospace', whiteSpace: 'pre-line' }}>{correctAnswer}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onHome} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>
            ← Home
          </button>
          <button onClick={onRetake} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            ↺ Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
