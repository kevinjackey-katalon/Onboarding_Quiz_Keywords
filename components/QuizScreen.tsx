'use client';

import { useState, useEffect, useRef } from 'react';
import { questions } from '@/lib/questions';
import type { UserAnswers } from './QuizApp';

interface Props {
  onSubmit: (answers: UserAnswers) => void;
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

/** Returns true if the stored answer for a question is correct */
function checkAnswer(q: (typeof questions)[0], answer: string | string[]): boolean {
  if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
    return answer === q.correctLetter;
  }
  if (q.type === 'Fill in the Blank') {
    const user = String(answer).trim().toLowerCase().replace(/['"]/g, '');
    const correct = (q.correctAnswer || '').trim().toLowerCase().replace(/['"]/g, '');
    return user === correct;
  }
  if (q.type === 'Drag to Order') {
    const userOrder = answer as string[];
    const correctOrder = q.orderedSteps || [];
    return (
      userOrder.length === correctOrder.length &&
      userOrder.every((step, idx) => step === correctOrder[idx])
    );
  }
  return false;
}

export default function QuizScreen({ onSubmit, onHome }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  // revealed: set of question ids for which feedback has been shown
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [fillDraft, setFillDraft] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const dragItem = useRef<number | null>(null);

  const q = questions[currentIndex];
  const catColor = CATEGORY_COLORS[q.category] || '#94a3b8';
  const isRevealed = revealed.has(q.id);
  const currentAnswer = answers[q.id];
  const isCorrect = isRevealed && currentAnswer !== undefined
    ? checkAnswer(q, currentAnswer)
    : null;
  const answeredCount = Object.keys(answers).length;
  const progress = (currentIndex / questions.length) * 100;

  // Sync fill-in draft when navigating
  useEffect(() => {
    if (q.type === 'Fill in the Blank') {
      setFillDraft((answers[q.id] as string) || '');
    }
  }, [currentIndex, q.id, q.type]);

  // Init drag order when switching to drag question
  useEffect(() => {
    if (q.type === 'Drag to Order') {
      const existing = answers[q.id] as string[] | undefined;
      if (existing && existing.length > 0) {
        setDragOrder(existing);
      } else {
        const shuffled = [...(q.orderedSteps || [])].sort(() => Math.random() - 0.5);
        setDragOrder(shuffled);
      }
    }
  }, [currentIndex, q.id, q.type, q.orderedSteps]);

  /** Commit an answer and immediately reveal feedback */
  const commitAnswer = (val: string | string[]) => {
    if (isRevealed) return; // already locked
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setRevealed(prev => new Set(prev).add(q.id));
  };

  // Drag handlers (only active before reveal)
  const handleDragStart = (idx: number) => { dragItem.current = idx; };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (!isRevealed) setDragOverIndex(idx);
  };
  const handleDrop = (idx: number) => {
    if (isRevealed || dragItem.current === null || dragItem.current === idx) return;
    const newOrder = [...dragOrder];
    const [removed] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(idx, 0, removed);
    setDragOrder(newOrder);
    setAnswers(prev => ({ ...prev, [q.id]: newOrder }));
    dragItem.current = null;
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { dragItem.current = null; setDragOverIndex(null); };
  const moveStep = (idx: number, dir: -1 | 1) => {
    if (isRevealed) return;
    const newOrder = [...dragOrder];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setDragOrder(newOrder);
    setAnswers(prev => ({ ...prev, [q.id]: newOrder }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setShowConfirm(true);
    }
  };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(i => i - 1); };
  const handleSubmit = () => { onSubmit(answers); };

  // ── OPTION STYLE HELPER ───────────────────────────────────────────────────
  const getOptionStyle = (letter: string) => {
    const selected = currentAnswer === letter;
    const correct = q.correctLetter === letter;

    if (!isRevealed) {
      return {
        bg: selected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
        border: selected ? '#3b82f6' : 'rgba(255,255,255,0.10)',
        color: selected ? '#93c5fd' : '#cbd5e1',
        badgeBg: selected ? '#3b82f6' : 'rgba(255,255,255,0.08)',
        badgeColor: selected ? 'white' : '#94a3b8',
        cursor: 'pointer',
      };
    }

    // Post-reveal
    if (correct) {
      return {
        bg: 'rgba(52,211,153,0.15)',
        border: '#34d399',
        color: '#d1fae5',
        badgeBg: '#34d399',
        badgeColor: '#064e3b',
        cursor: 'default',
      };
    }
    if (selected && !correct) {
      return {
        bg: 'rgba(248,113,113,0.15)',
        border: '#f87171',
        color: '#fee2e2',
        badgeBg: '#f87171',
        badgeColor: '#7f1d1d',
        cursor: 'default',
      };
    }
    return {
      bg: 'rgba(255,255,255,0.02)',
      border: 'rgba(255,255,255,0.06)',
      color: '#475569',
      badgeBg: 'rgba(255,255,255,0.05)',
      badgeColor: '#475569',
      cursor: 'default',
    };
  };

  // ── FEEDBACK BANNER ────────────────────────────────────────────────────────
  const renderFeedback = () => {
    if (!isRevealed) return null;
    const correct = isCorrect;

    // For drag/fill, build a plain-text explanation of the correct answer
    let explanation = '';
    if (q.type === 'Fill in the Blank') {
      explanation = `Correct answer: ${q.correctAnswer}`;
    } else if (q.type === 'Drag to Order') {
      if (!correct) {
        explanation = 'Correct order:\n' +
          (q.orderedSteps || []).map((s, i) => `${i + 1}. ${s}`).join('\n');
      }
    } else if ((q.type === 'Spot the Bug') && q.correctAnswer) {
      explanation = q.correctAnswer;
    }

    return (
      <div style={{
        marginTop: 20,
        padding: '16px 20px',
        borderRadius: 12,
        background: correct ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
        border: `1px solid ${correct ? 'rgba(52,211,153,0.35)' : 'rgba(248,113,113,0.35)'}`,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>
          {correct ? '✅' : '❌'}
        </span>
        <div>
          <p style={{
            margin: '0 0 4px',
            fontWeight: 700,
            fontSize: 15,
            color: correct ? '#34d399' : '#f87171',
          }}>
            {correct ? 'Correct!' : 'Not quite.'}
          </p>
          {explanation && (
            <p style={{
              margin: 0,
              fontSize: 13,
              color: '#94a3b8',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              fontFamily: q.type === 'Fill in the Blank' || q.type === 'Spot the Bug'
                ? 'monospace' : 'inherit',
            }}>
              {explanation}
            </p>
          )}
        </div>
      </div>
    );
  };

  // ── QUESTION RENDERERS ────────────────────────────────────────────────────
  const renderQuestion = () => {
    if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
      const isCode = q.type === 'Spot the Bug';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(q.options || []).map(opt => {
            const s = getOptionStyle(opt.letter);
            const isCorrectOpt = isRevealed && q.correctLetter === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => !isRevealed && commitAnswer(opt.letter)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 18px',
                  background: s.bg,
                  border: `2px solid ${s.border}`,
                  borderRadius: 12,
                  cursor: s.cursor as 'pointer' | 'default',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  color: s.color,
                  width: '100%',
                }}
              >
                <span style={{
                  minWidth: 28, height: 28, borderRadius: 8,
                  background: s.badgeBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: s.badgeColor, flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isRevealed && isCorrectOpt ? '✓' :
                   isRevealed && currentAnswer === opt.letter && !isCorrectOpt ? '✗' :
                   opt.letter}
                </span>
                <span style={{
                  fontSize: isCode ? 13 : 15,
                  fontFamily: isCode ? 'monospace' : 'inherit',
                  lineHeight: 1.5, paddingTop: 2,
                }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    if (q.type === 'Fill in the Blank') {
      const fillCorrect = isRevealed && isCorrect;
      const fillWrong = isRevealed && !isCorrect;
      return (
        <div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={fillDraft}
              onChange={e => { if (!isRevealed) setFillDraft(e.target.value); }}
              onKeyDown={e => { if (e.key === 'Enter' && fillDraft.trim() && !isRevealed) commitAnswer(fillDraft.trim()); }}
              disabled={isRevealed}
              placeholder="Type your answer here…"
              style={{
                flex: 1,
                background: fillCorrect ? 'rgba(52,211,153,0.1)' : fillWrong ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)',
                border: `2px solid ${fillCorrect ? '#34d399' : fillWrong ? '#f87171' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 12, padding: '14px 18px',
                color: '#f1f5f9', fontSize: 16, outline: 'none',
                fontFamily: 'monospace',
                opacity: isRevealed ? 0.75 : 1,
                transition: 'all 0.2s',
              }}
            />
            {!isRevealed && (
              <button
                onClick={() => { if (fillDraft.trim()) commitAnswer(fillDraft.trim()); }}
                disabled={!fillDraft.trim()}
                style={{
                  padding: '14px 20px', borderRadius: 12, border: 'none',
                  background: fillDraft.trim() ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.08)',
                  color: fillDraft.trim() ? 'white' : '#4b5563',
                  fontSize: 14, fontWeight: 700, cursor: fillDraft.trim() ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                }}
              >
                Check →
              </button>
            )}
          </div>
          {!isRevealed && (
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
              Case-sensitive. Press Enter or click Check to submit.
            </p>
          )}
        </div>
      );
    }

    if (q.type === 'Drag to Order') {
      const dragCorrect = isRevealed && isCorrect;
      const correctOrder = q.orderedSteps || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!isRevealed && (
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 4px' }}>
              Drag items or use ↑↓ to reorder, then click <strong>Check Order</strong>.
            </p>
          )}
          {dragOrder.map((step, idx) => {
            const positionCorrect = isRevealed && step === correctOrder[idx];
            const positionWrong = isRevealed && step !== correctOrder[idx];
            return (
              <div
                key={step}
                draggable={!isRevealed}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={isRevealed ? '' : 'drag-item'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  background: positionCorrect ? 'rgba(52,211,153,0.1)' :
                              positionWrong ? 'rgba(248,113,113,0.08)' :
                              dragOverIndex === idx ? 'rgba(99,179,237,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${positionCorrect ? '#34d399' :
                                       positionWrong ? '#f87171' :
                                       dragOverIndex === idx ? '#63b3ed' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 10, transition: 'all 0.2s',
                }}
              >
                <span style={{
                  minWidth: 24, height: 24, borderRadius: 6,
                  background: positionCorrect ? '#34d399' : positionWrong ? '#f87171' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: positionCorrect ? '#064e3b' : positionWrong ? '#7f1d1d' : '#94a3b8',
                }}>
                  {positionCorrect ? '✓' : positionWrong ? '✗' : idx + 1}
                </span>
                <span style={{ flex: 1, color: positionCorrect ? '#d1fae5' : positionWrong ? '#fee2e2' : '#cbd5e1', fontSize: 14, lineHeight: 1.4 }}>
                  {!isRevealed && '⠿ '}{step}
                </span>
                {!isRevealed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? '#374151' : '#94a3b8', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>▲</button>
                    <button onClick={() => moveStep(idx, 1)} disabled={idx === dragOrder.length - 1} style={{ background: 'none', border: 'none', color: idx === dragOrder.length - 1 ? '#374151' : '#94a3b8', cursor: idx === dragOrder.length - 1 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>▼</button>
                  </div>
                )}
              </div>
            );
          })}
          {!isRevealed && (
            <button
              onClick={() => commitAnswer(dragOrder)}
              style={{
                marginTop: 8, padding: '12px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Check Order →
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  // ── CONFIRM SUBMIT MODAL ──────────────────────────────────────────────────
  if (showConfirm) {
    const unanswered = questions.length - answeredCount;
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Submit Quiz?</h2>
          {unanswered > 0 ? (
            <p style={{ color: '#f87171', fontSize: 15, margin: '0 0 24px' }}>
              You have <strong>{unanswered}</strong> unanswered question{unanswered !== 1 ? 's' : ''}. These will be marked incorrect.
            </p>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 24px' }}>
              All {questions.length} questions answered. Ready to see your results?
            </p>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', fontSize: 15, cursor: 'pointer' }}>
              ← Review
            </button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>← Exit</button>
        <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>{answeredCount} / {questions.length} answered</span>
        <span style={{ color: '#64748b', fontSize: 13 }}>{currentIndex + 1} of {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ flex: 1, maxWidth: 760, margin: '0 auto', width: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* Category badge + type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ background: `${catColor}20`, border: `1px solid ${catColor}60`, color: catColor, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {q.category}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#64748b', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {q.type === 'Multiple Choice' ? '🔘 Multiple Choice' :
             q.type === 'Fill in the Blank' ? '✏️ Fill in the Blank' :
             q.type === 'Spot the Bug' ? '🐛 Spot the Bug' : '🔀 Drag to Order'}
          </span>
        </div>

        {/* Question text */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 600, lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
            Q{currentIndex + 1}. {q.question}
          </h2>
        </div>

        {/* Answer area + inline feedback */}
        <div style={{ flex: 1 }}>
          {renderQuestion()}
          {renderFeedback()}
        </div>

        {/* Navigation — Next only unlocks after feedback shown (or on revisit) */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: currentIndex === 0 ? '#374151' : '#94a3b8', fontSize: 15, cursor: currentIndex === 0 ? 'default' : 'pointer' }}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isRevealed}
            style={{
              flex: 1, padding: '12px 24px', borderRadius: 10, border: 'none',
              background: isRevealed
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                : 'rgba(255,255,255,0.08)',
              color: isRevealed ? 'white' : '#4b5563',
              fontSize: 15, fontWeight: 700,
              cursor: isRevealed ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            {isRevealed
              ? (currentIndex < questions.length - 1 ? 'Next →' : 'Review & Submit →')
              : 'Answer to continue…'}
          </button>
        </div>
      </div>
    </div>
  );
}
