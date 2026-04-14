'use client';

import { useState } from 'react';
import { questions, PASS_MARK, CATEGORIES } from '@/lib/questions';

interface Props {
  onStart: (name: string, organisation: string, quizName: string) => void;
  onAdmin: () => void;
}

export default function LandingScreen({ onStart, onAdmin }: Props) {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [quizName, setQuizName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    setError('');
    onStart(name.trim(), organisation.trim(), quizName.trim() || 'Katalon Keywords & Advanced Quiz');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 50%, #0f1117 100%)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧪</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0', letterSpacing: '0.02em' }}>Katalon Studio</span>
        </div>
        <button
          onClick={onAdmin}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ⚙ Admin
        </button>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
            Professional Training
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.2 }}>
            Katalon Studio<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Keywords &amp; Advanced Quiz</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
            Enter your details to begin. Your results will be recorded for training review.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: '36px 32px', marginBottom: 32 }}>
          {/* Full Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Enter your full name"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 15, outline: 'none' }}
            />
          </div>

          {/* Organisation */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Organisation <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span></label>
            <input
              type="text"
              value={organisation}
              onChange={e => setOrganisation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="Your company or team"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 15, outline: 'none' }}
            />
          </div>

          {/* Quiz Name */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Quiz Name <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span></label>
            <input
              type="text"
              value={quizName}
              onChange={e => setQuizName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="e.g. Onboarding Cohort June 2025"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 15, outline: 'none' }}
            />
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 16px' }}>{error}</p>}
          <button
            onClick={handleStart}
            style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', color: 'white', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
          >
            Begin Quiz →
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { value: questions.length.toString(), label: 'Questions' },
            { value: CATEGORIES.length.toString(), label: 'Topics' },
            { value: `${Math.round(PASS_MARK * 100)}%`, label: 'Pass Mark' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#60a5fa', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
