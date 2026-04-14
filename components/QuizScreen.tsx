'use client';

import { useState, useEffect, useRef } from 'react';
import { questions } from '@/lib/questions';
import type { UserAnswers } from './QuizApp';

interface Props {
  onSubmit: (answers: UserAnswers) => void;
  onHome: () => void;
  userName: string;
}

function checkAnswer(q: (typeof questions)[0], answer: string | string[]): boolean {
  if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') return answer === q.correctLetter;
  if (q.type === 'Fill in the Blank') {
    const u = String(answer).trim().toLowerCase().replace(/['"]/g, '');
    const c = (q.correctAnswer || '').trim().toLowerCase().replace(/['"]/g, '');
    return u === c;
  }
  if (q.type === 'Drag to Order') {
    const uo = answer as string[];
    const co = q.orderedSteps || [];
    return uo.length === co.length && uo.every((s, i) => s === co[i]);
  }
  return false;
}

export default function QuizScreen({ onSubmit, onHome, userName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [fillDraft, setFillDraft] = useState('');
  const [streak, setStreak] = useState(0);
  const dragSrc = useRef<string | null>(null);

  const q = questions[currentIndex];
  const isRevealed = revealed.has(q.id);
  const currentAnswer = answers[q.id];
  const isCorrect = isRevealed && currentAnswer !== undefined ? checkAnswer(q, currentAnswer) : null;
  const answeredCount = Object.keys(answers).length;
  const progress = (currentIndex / questions.length) * 100;

  useEffect(() => {
    if (q.type === 'Fill in the Blank') setFillDraft((answers[q.id] as string) || '');
  }, [currentIndex, q.id, q.type]);

  useEffect(() => {
    if (q.type === 'Drag to Order') {
      const existing = answers[q.id] as string[] | undefined;
      if (existing?.length) { setDragOrder(existing); }
      else { setDragOrder([...(q.orderedSteps || [])].sort(() => Math.random() - .5)); }
    }
  }, [currentIndex, q.id, q.type, q.orderedSteps]);

  const commitAnswer = (val: string | string[]) => {
    if (isRevealed) return;
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setRevealed(prev => new Set(prev).add(q.id));
    const ok = checkAnswer(q, val);
    setStreak(ok ? s => s + 1 : 0);
  };

  // Drag handlers
  const handleDragStart = (id: string) => { dragSrc.current = id; };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (!isRevealed) setDragOverId(id); };
  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (isRevealed || !dragSrc.current || dragSrc.current === id) return;
    const newOrder = [...dragOrder];
    const from = newOrder.indexOf(dragSrc.current);
    const to = newOrder.indexOf(id);
    if (from === -1 || to === -1) return;
    if (from < to) newOrder.splice(to + 1, 0, newOrder[from]); else newOrder.splice(to, 0, newOrder[from]);
    const removeIdx = from < to ? from : from + 1;
    newOrder.splice(removeIdx, 1);
    setDragOrder(newOrder);
    setAnswers(prev => ({ ...prev, [q.id]: newOrder }));
    dragSrc.current = null; setDragOverId(null);
  };
  const handleDragEnd = () => { dragSrc.current = null; setDragOverId(null); };
  const moveStep = (idx: number, dir: -1 | 1) => {
    if (isRevealed) return;
    const t = idx + dir;
    if (t < 0 || t >= dragOrder.length) return;
    const no = [...dragOrder]; [no[idx], no[t]] = [no[t], no[idx]];
    setDragOrder(no); setAnswers(prev => ({ ...prev, [q.id]: no }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    else onSubmit(answers);
  };

  const typeLabel: Record<string, string> = { 'Fill in the Blank': 'Fill in the Blank', 'Spot the Bug': 'Spot the Bug', 'Drag to Order': 'Order the Steps' };
  const isSpecial = q.type !== 'Multiple Choice';

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Quiz header */}
        <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeDown .6s ease both' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', letterSpacing: 1, marginBottom: 4 }}>
            Good luck, {userName.split(' ')[0]}!
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 }}>Katalon Keywords Quiz</h2>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 4, width: `${progress}%`, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            {currentIndex} / {questions.length}
          </div>
        </div>

        {/* Streak banner */}
        {streak >= 3 && (
          <div style={{ background: 'rgba(79,255,176,.1)', border: '1px solid rgba(79,255,176,.25)', borderRadius: 8, padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', textAlign: 'center', marginBottom: 16, animation: 'fadeIn .3s ease' }}>
            🔥 {streak} correct in a row!
          </div>
        )}

        {/* Question card */}
        <div
          key={currentIndex}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
            padding: 36, marginBottom: 20, position: 'relative', overflow: 'hidden',
            animation: 'slideUp .4s ease both',
          }}
        >
          {/* top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '16px 16px 0 0' }} />

          {/* Category / exercise pill */}
          {isSpecial ? (
            <div style={{ display: 'inline-block', background: 'rgba(203,166,247,.1)', border: '1px solid rgba(203,166,247,.3)', color: '#cba6f7', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4, marginBottom: 14 }}>
              ⌨ {typeLabel[q.type]} — {q.category}
            </div>
          ) : (
            <div style={{ display: 'inline-block', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent2)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4, marginBottom: 14 }}>
              {q.category}
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginBottom: 8 }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, color: 'var(--text)', marginBottom: 28, whiteSpace: 'pre-line' }}>
            {q.question}
          </div>

          {/* ── MCQ / SPOT THE BUG ── */}
          {(q.type === 'Multiple Choice' || q.type === 'Spot the Bug') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(q.options || []).map((opt, i) => {
                const selected = currentAnswer === opt.letter;
                const isCorrectOpt = q.correctLetter === opt.letter;
                let anim = '';
                if (isRevealed && isCorrectOpt) anim = 'pulse-correct .4s ease';
                else if (isRevealed && selected && !isCorrectOpt) anim = 'shake .4s ease';
                const isCode = q.type === 'Spot the Bug';
                return (
                  <button
                    key={opt.letter}
                    disabled={isRevealed}
                    onClick={() => !isRevealed && commitAnswer(opt.letter)}
                    style={{
                      background: isRevealed && isCorrectOpt ? 'rgba(79,255,176,.08)' : isRevealed && selected && !isCorrectOpt ? 'rgba(255,95,135,.08)' : 'var(--surface2)',
                      border: `1.5px solid ${isRevealed && isCorrectOpt ? 'var(--accent)' : isRevealed && selected && !isCorrectOpt ? 'var(--accent3)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '14px 18px', cursor: isRevealed ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%',
                      fontSize: 14, color: isRevealed && (isCorrectOpt || (selected && !isCorrectOpt)) ? 'var(--text)' : isRevealed ? 'rgba(232,234,242,0.4)' : 'var(--text)',
                      transition: 'border-color .2s, background .2s, transform .15s',
                      opacity: isRevealed && !isCorrectOpt && !selected ? 0.55 : 1,
                      animation: anim,
                    }}
                    onMouseOver={e => { if (!isRevealed) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; } }}
                    onMouseOut={e => { if (!isRevealed) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; } }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      background: isRevealed && isCorrectOpt ? 'var(--accent)' : isRevealed && selected && !isCorrectOpt ? 'var(--accent3)' : 'var(--bg)',
                      border: `1px solid ${isRevealed && isCorrectOpt ? 'var(--accent)' : isRevealed && selected && !isCorrectOpt ? 'var(--accent3)' : 'var(--border)'}`,
                      color: isRevealed && isCorrectOpt ? '#000' : isRevealed && selected && !isCorrectOpt ? '#fff' : 'var(--muted)',
                      borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s, color .2s',
                    }}>
                      {opt.letter}
                    </span>
                    <span style={{ fontFamily: isCode ? 'var(--font-mono)' : 'inherit', fontSize: isCode ? 12.5 : 14, lineHeight: 1.6 }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── FILL IN THE BLANK ── */}
          {q.type === 'Fill in the Blank' && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Complete the code</div>
              <div style={{ background: '#0a0c10', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.9, color: '#cdd6f4', marginBottom: 20, overflowX: 'auto', whiteSpace: 'pre' }}>
                {q.question.includes('\n') ? q.question.split('\n').slice(1).join('\n').replace('______', '').replace(/_{3,}/g, '') : ''}
                <input
                  value={fillDraft}
                  onChange={e => { if (!isRevealed) setFillDraft(e.target.value); }}
                  onKeyDown={e => { if (e.key === 'Enter' && fillDraft.trim() && !isRevealed) commitAnswer(fillDraft.trim()); }}
                  disabled={isRevealed}
                  placeholder="..."
                  style={{
                    background: 'rgba(79,255,176,.08)', border: 'none',
                    borderBottom: `2px solid ${isRevealed ? (isCorrect ? 'var(--accent)' : 'var(--accent3)') : 'var(--accent)'}`,
                    color: isRevealed ? (isCorrect ? 'var(--accent)' : 'var(--accent3)') : 'var(--accent)',
                    fontFamily: 'var(--font-mono)', fontSize: 12.5, padding: '0 6px', outline: 'none', minWidth: 180, transition: 'border-color .2s',
                  }}
                />
              </div>
              {!isRevealed && (
                <button
                  onClick={() => { if (fillDraft.trim()) commitAnswer(fillDraft.trim()); }}
                  disabled={!fillDraft.trim()}
                  style={{ background: 'transparent', border: `1.5px solid ${fillDraft.trim() ? 'var(--accent)' : 'var(--border)'}`, color: fillDraft.trim() ? 'var(--accent)' : 'var(--muted)', borderRadius: 8, padding: '9px 22px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, cursor: fillDraft.trim() ? 'pointer' : 'default', transition: 'background .2s', display: 'block', marginBottom: 4 }}>
                  Check Answer
                </button>
              )}
            </div>
          )}

          {/* ── DRAG TO ORDER ── */}
          {q.type === 'Drag to Order' && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Drag to put in correct order</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {dragOrder.map((step, idx) => {
                  const posOk = isRevealed && step === (q.orderedSteps || [])[idx];
                  const posWrong = isRevealed && step !== (q.orderedSteps || [])[idx];
                  return (
                    <div
                      key={step}
                      draggable={!isRevealed}
                      onDragStart={() => handleDragStart(step)}
                      onDragOver={e => handleDragOver(e, step)}
                      onDrop={e => handleDrop(e, step)}
                      onDragEnd={handleDragEnd}
                      style={{
                        background: posOk ? 'rgba(79,255,176,.07)' : posWrong ? 'rgba(255,95,135,.07)' : dragOverId === step ? 'rgba(0,200,255,.07)' : 'var(--surface2)',
                        border: `1.5px solid ${posOk ? 'var(--accent)' : posWrong ? 'var(--accent3)' : dragOverId === step ? 'var(--accent2)' : 'var(--border)'}`,
                        borderRadius: 8, padding: '11px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#cdd6f4',
                        cursor: isRevealed ? 'default' : 'grab', display: 'flex', alignItems: 'center', gap: 10,
                        transition: 'border-color .2s, background .2s, transform .15s', userSelect: 'none',
                      }}
                    >
                      {!isRevealed && <span style={{ color: 'var(--muted)', fontSize: 16, flexShrink: 0, lineHeight: 1 }}>⠿</span>}
                      <span style={{ fontSize: 10, color: posOk ? 'var(--accent)' : posWrong ? 'var(--accent3)' : 'var(--muted)', background: 'var(--bg)', border: `1px solid ${posOk ? 'var(--accent)' : posWrong ? 'var(--accent3)' : 'var(--border)'}`, borderRadius: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>{idx + 1}</span>
                      <span style={{ flex: 1 }}>{step}</span>
                      {!isRevealed && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'var(--border)' : 'var(--muted)', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 12, padding: '1px 4px', lineHeight: 1 }}>▲</button>
                          <button onClick={() => moveStep(idx, 1)} disabled={idx === dragOrder.length - 1} style={{ background: 'none', border: 'none', color: idx === dragOrder.length - 1 ? 'var(--border)' : 'var(--muted)', cursor: idx === dragOrder.length - 1 ? 'default' : 'pointer', fontSize: 12, padding: '1px 4px', lineHeight: 1 }}>▼</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {!isRevealed && (
                <button onClick={() => commitAnswer(dragOrder)} style={{ background: 'transparent', border: '1.5px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, padding: '9px 22px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'background .2s', display: 'block', marginBottom: 4 }}>
                  Check Order
                </button>
              )}
            </div>
          )}

          {/* ── FEEDBACK STRIP ── */}
          {isRevealed && (
            <div style={{
              display: 'block', marginTop: 20, padding: '14px 18px', borderRadius: 10,
              fontSize: 14, lineHeight: 1.5,
              borderLeft: `3px solid ${isCorrect ? 'var(--accent)' : 'var(--accent3)'}`,
              background: isCorrect ? 'rgba(79,255,176,.07)' : 'rgba(255,95,135,.07)',
              color: isCorrect ? '#a7ffe0' : '#ffb3c6',
              animation: 'fadeIn .3s ease',
            }}>
              <strong style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
              </strong>
              {q.explanation}
            </div>
          )}
        </div>

        {/* Next button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            onClick={handleNext}
            disabled={!isRevealed}
            style={{
              background: isRevealed ? 'var(--accent)' : 'transparent',
              color: isRevealed ? '#000' : 'var(--muted)',
              border: isRevealed ? 'none' : '1px solid var(--border)',
              borderRadius: 8, padding: '12px 28px',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '.5px',
              cursor: isRevealed ? 'pointer' : 'default',
              transition: 'opacity .2s, transform .15s',
              display: isRevealed ? 'block' : 'block',
              opacity: isRevealed ? 1 : 0.4,
            }}
            onMouseOver={e => { if (isRevealed) { (e.target as HTMLElement).style.opacity = '.88'; (e.target as HTMLElement).style.transform = 'translateY(-1px)'; } }}
            onMouseOut={e => { if (isRevealed) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; } }}
          >
            {currentIndex < questions.length - 1 ? 'Next →' : 'See Results'}
          </button>
        </div>
      </div>
    </div>
  );
}
