'use client';

import { useState } from 'react';
import { questions, PASS_MARK, CATEGORIES } from '@/lib/questions';

interface Props {
  onStart: (name: string, organisation: string) => void;
  onAdmin: () => void;
}

export default function LandingScreen({ onStart, onAdmin }: Props) {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (!name.trim()) { setError(true); return; }
    setError(false);
    onStart(name.trim(), organisation.trim());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <button
        onClick={onAdmin}
        style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', cursor: 'pointer', zIndex: 100, transition: 'color .2s, border-color .2s' }}
        onMouseOver={e => { (e.target as HTMLElement).style.color = 'var(--accent)'; (e.target as HTMLElement).style.borderColor = 'var(--accent)'; }}
        onMouseOut={e => { (e.target as HTMLElement).style.color = 'var(--muted)'; (e.target as HTMLElement).style.borderColor = 'var(--border)'; }}
      >
        ⚙ Admin
      </button>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20,
        padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center',
        position: 'relative', animation: 'slideUp .5s ease both',
      }}>
        {/* top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '20px 20px 0 0' }} />

        <div style={{ display: 'inline-block', background: 'rgba(79,255,176,.1)', border: '1px solid rgba(79,255,176,.3)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 999, marginBottom: 20 }}>
          Professional Training
        </div>

        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          Katalon Studio<br />
          <span style={{ color: 'var(--accent)' }}>Keywords Reference</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Test your knowledge of Katalon keywords across Web, API, Mobile and Desktop. Your results will be recorded for training review.
        </p>

        <input
          className="name-input"
          type="text"
          placeholder="Your full name"
          maxLength={60}
          autoComplete="off"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          style={{
            width: '100%', background: 'var(--surface2)', border: `1.5px solid ${error ? 'var(--accent3)' : 'var(--border)'}`,
            borderRadius: 10, padding: '14px 18px', color: 'var(--text)',
            fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none',
            transition: 'border-color .2s', marginBottom: 10, display: 'block',
          }}
        />
        <input
          type="text"
          placeholder="Your organisation (optional)"
          maxLength={80}
          autoComplete="off"
          value={organisation}
          onChange={e => setOrganisation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          style={{
            width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)',
            borderRadius: 10, padding: '14px 18px', color: 'var(--text)',
            fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none',
            transition: 'border-color .2s', marginBottom: 10, display: 'block',
          }}
        />
        {error && (
          <div style={{ color: 'var(--accent3)', fontSize: 12, marginBottom: 10, fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
            Please enter your name to continue.
          </div>
        )}

        <button
          onClick={handleStart}
          style={{
            width: '100%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: '#000', border: 'none', borderRadius: 10, padding: 14,
            fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '.5px', transition: 'opacity .2s, transform .15s',
          }}
          onMouseOver={e => { (e.target as HTMLElement).style.opacity = '.88'; (e.target as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          Begin Quiz →
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          {[
            { val: questions.length, lbl: 'Questions' },
            { val: CATEGORIES.length, lbl: 'Topics' },
            { val: `${Math.round(PASS_MARK * 100)}%`, lbl: 'Pass Mark' },
          ].map(m => (
            <div key={m.lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{m.val}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{m.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
