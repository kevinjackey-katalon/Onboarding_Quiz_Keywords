'use client';

import { useEffect, useRef } from 'react';
import { questions } from '@/lib/questions';
import type { QuizResult } from './QuizApp';

interface Props {
  result: QuizResult;
  onRetake: () => void;
  onHome: () => void;
}

function getAnswerSummary(qIndex: number, result: QuizResult) {
  const q = questions[qIndex];
  const userRaw = result.answers[q.id];

  if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
    const ul = userRaw as string | undefined;
    const cl = q.correctLetter || '';
    const uOpt = q.options?.find(o => o.letter === ul);
    const cOpt = q.options?.find(o => o.letter === cl);
    return {
      ok: ul === cl,
      yours: ul ? `${ul}) ${uOpt?.text || ''}` : '(no answer)',
      correct: `${cl}) ${cOpt?.text || ''}`,
    };
  }
  if (q.type === 'Fill in the Blank') {
    const u = String(userRaw || '').trim();
    const c = (q.correctAnswer || '').trim();
    const ok = u.toLowerCase().replace(/['"]/g, '') === c.toLowerCase().replace(/['"]/g, '');
    return { ok, yours: u || '(no answer)', correct: c };
  }
  if (q.type === 'Drag to Order') {
    const uo = (userRaw as string[] | undefined) || [];
    const co = q.orderedSteps || [];
    const ok = uo.length === co.length && uo.every((s, i) => s === co[i]);
    return {
      ok,
      yours: uo.length ? uo.map((s, i) => `${i + 1}. ${s}`).join('\n') : '(no answer)',
      correct: co.map((s, i) => `${i + 1}. ${s}`).join('\n'),
    };
  }
  return { ok: false, yours: '(no answer)', correct: '' };
}

export default function ResultsScreen({ result, onRetake, onHome }: Props) {
  const pct = Math.round((result.score / result.total) * 100);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(440 - (pct / 100) * 440);
    }, 100);
  }, [pct]);

  let title = '', sub = '';
  if (pct >= 90)       { title = '🏆 Outstanding!';     sub = 'Excellent mastery of Katalon keywords.'; }
  else if (pct >= 75)  { title = '✅ Well Done!';        sub = 'Strong understanding with a few areas to review.'; }
  else if (pct >= 60)  { title = '📘 Good Effort';       sub = 'Solid foundation — revisit the sections below.'; }
  else                 { title = '🔄 Keep Practicing';   sub = 'Review the training material and retake the quiz.'; }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px', textAlign: 'center' }}>

        {/* SVG score ring */}
        <div style={{ width: 160, height: 160, margin: '0 auto 32px', position: 'relative' }}>
          <svg viewBox="0 0 160 160" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4fffb0" />
                <stop offset="100%" stopColor="#00c8ff" />
              </linearGradient>
            </defs>
            <circle fill="none" stroke="var(--border)" strokeWidth={10} cx={80} cy={80} r={70} />
            <circle
              ref={ringRef}
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={440}
              strokeDashoffset={440}
              cx={80} cy={80} r={70}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1) .3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{result.score}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>/ {result.total}</div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{title}</div>
        <div style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
          {sub} You scored {result.score} out of {result.total} ({pct}%).
        </div>

        {/* Category stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: 32 }}>
          {Object.entries(result.categoryScores).filter(([, s]) => s.total > 0).map(([cat, s]) => {
            const p = Math.round((s.correct / s.total) * 100);
            return (
              <div key={cat} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{cat}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{s.correct}/{s.total}</div>
                <div style={{ height: 3, background: 'var(--border)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 4, width: `${p}%`, transition: 'width 1s cubic-bezier(.4,0,.2,1) .5s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 32, textAlign: 'left' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase' }}>
            Question Review
          </div>
          {questions.map((q, idx) => {
            const { ok, yours, correct } = getAnswerSummary(idx, result);
            return (
              <div key={q.id} style={{ padding: '14px 24px', borderBottom: idx < questions.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 13 }}>
                <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{ok ? '✅' : '❌'}</div>
                <div>
                  <div style={{ color: 'var(--text)', lineHeight: 1.4, fontSize: 13 }}>{q.question.split('\n')[0]}</div>
                  {!ok && (
                    <>
                      <div style={{ color: 'var(--accent3)', fontSize: 12, marginTop: 3, whiteSpace: 'pre-line' }}>Yours: {yours}</div>
                      <div style={{ color: 'var(--accent)', fontSize: 12, marginTop: 2, whiteSpace: 'pre-line' }}>Correct: {correct}</div>
                    </>
                  )}
                  {ok && <div style={{ color: 'var(--accent)', fontSize: 12, marginTop: 3 }}>{correct}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onRetake}
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#000', border: 'none', borderRadius: 10, padding: '14px 40px', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s, transform .15s' }}
          onMouseOver={e => { (e.target as HTMLElement).style.opacity = '.88'; (e.target as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          ↺ Retake Quiz
        </button>
      </div>
    </div>
  );
}
