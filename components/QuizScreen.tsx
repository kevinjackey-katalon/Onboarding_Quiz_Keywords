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

export default function QuizScreen({ onSubmit, onHome }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [dragOrder, setDragOrder] = useState<string[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const dragItem = useRef<number | null>(null);
  const touchStartY = useRef<number>(0);

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const answered = answers[q.id] !== undefined;

  // Init drag order when switching to drag question
  useEffect(() => {
    if (q.type === 'Drag to Order') {
      const existing = answers[q.id] as string[] | undefined;
      if (existing && existing.length > 0) {
        setDragOrder(existing);
      } else {
        // Shuffle the steps
        const shuffled = [...(q.orderedSteps || [])].sort(() => Math.random() - 0.5);
        setDragOrder(shuffled);
      }
    }
  }, [currentIndex, q.id, q.type, q.orderedSteps]);

  const setAnswer = (val: string | string[]) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  // --- Drag to Order ---
  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragItem.current === null || dragItem.current === idx) return;
    const newOrder = [...dragOrder];
    const [removed] = newOrder.splice(dragItem.current, 1);
    newOrder.splice(idx, 0, removed);
    setDragOrder(newOrder);
    setAnswer(newOrder);
    dragItem.current = null;
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    dragItem.current = null;
    setDragOverIndex(null);
  };
  const moveStep = (idx: number, dir: -1 | 1) => {
    const newOrder = [...dragOrder];
    const target = idx + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
    setDragOrder(newOrder);
    setAnswer(newOrder);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const answeredCount = Object.keys(answers).length;
  const catColor = CATEGORY_COLORS[q.category] || '#94a3b8';

  const renderQuestion = () => {
    if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
      const userAnswer = answers[q.id] as string | undefined;
      const isCode = q.type === 'Spot the Bug';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(q.options || []).map(opt => {
            const selected = userAnswer === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => setAnswer(opt.letter)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
                  background: selected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${selected ? '#3b82f6' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  color: selected ? '#93c5fd' : '#cbd5e1',
                }}
              >
                <span style={{
                  minWidth: 28, height: 28, borderRadius: 8, background: selected ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: selected ? 'white' : '#94a3b8', flexShrink: 0,
                }}>{opt.letter}</span>
                <span style={{ fontSize: isCode ? 13 : 15, fontFamily: isCode ? 'monospace' : 'inherit', lineHeight: 1.5, paddingTop: 2 }}>{opt.text}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (q.type === 'Fill in the Blank') {
      const userAnswer = answers[q.id] as string | undefined;
      return (
        <div>
          <input
            type="text"
            value={userAnswer || ''}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 12, padding: '14px 18px', color: '#f1f5f9', fontSize: 16, outline: 'none',
              fontFamily: 'monospace',
            }}
          />
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
            Tip: Answer is case-sensitive. Do not include surrounding quotes unless they are part of the answer.
          </p>
        </div>
      );
    }

    if (q.type === 'Drag to Order') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 8px' }}>Drag items or use ↑↓ buttons to reorder:</p>
          {dragOrder.map((step, idx) => (
            <div
              key={step}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className="drag-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                background: dragOverIndex === idx ? 'rgba(99,179,237,0.1)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${dragOverIndex === idx ? '#63b3ed' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 10, transition: 'all 0.15s',
              }}
            >
              <span style={{ minWidth: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{idx + 1}</span>
              <span style={{ flex: 1, color: '#cbd5e1', fontSize: 14, lineHeight: 1.4 }}>⠿ {step}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={() => moveStep(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? '#374151' : '#94a3b8', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>▲</button>
                <button onClick={() => moveStep(idx, 1)} disabled={idx === dragOrder.length - 1} style={{ background: 'none', border: 'none', color: idx === dragOrder.length - 1 ? '#374151' : '#94a3b8', cursor: idx === dragOrder.length - 1 ? 'default' : 'pointer', fontSize: 14, padding: '2px 6px' }}>▼</button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (showConfirm) {
    const unanswered = questions.length - answeredCount;
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Submit Quiz?</h2>
          {unanswered > 0 ? (
            <p style={{ color: '#f87171', fontSize: 15, margin: '0 0 24px' }}>
              You have <strong>{unanswered}</strong> unanswered question{unanswered !== 1 ? 's' : ''}. Unanswered questions will be marked as incorrect.
            </p>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 15, margin: '0 0 24px' }}>
              You have answered all {questions.length} questions. Ready to see your results?
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

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>← Exit</button>
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

        {/* Question */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 600, lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
            Q{currentIndex + 1}. {q.question}
          </h2>
        </div>

        {/* Answer area */}
        <div style={{ flex: 1 }}>
          {renderQuestion()}
        </div>

        {/* Navigation */}
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
            style={{ flex: 1, padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            {currentIndex < questions.length - 1 ? 'Next →' : 'Review & Submit →'}
          </button>
        </div>
      </div>
    </div>
  );
}
