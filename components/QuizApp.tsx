'use client';

import { useState, useCallback } from 'react';
import { questions as ALL_QUESTIONS, PASS_MARK, CATEGORIES } from '@/lib/questions';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';
import AdminScreen from './AdminScreen';

export type Screen = 'landing' | 'quiz' | 'results' | 'admin';

export interface UserAnswers {
  [questionId: number]: string | string[];
}

const QUIZ_NAME = 'Katalon Keywords Reference Quiz';
const QUESTIONS_PER_QUIZ = 20;

/** Seeded Fisher-Yates shuffle — picks QUESTIONS_PER_QUIZ from the full bank each time */
function pickQuestions() {
  const pool = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return pool.slice(0, QUESTIONS_PER_QUIZ);
}

export interface QuizResult {
  name: string;
  organisation: string;
  quiz: string;
  score: number;
  total: number;
  passed: boolean;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
  answers: UserAnswers;
  activeQuestions: number[]; // ids of the 20 questions that were actually asked
}

function gradeAnswers(
  answers: UserAnswers,
  activeIds: number[],
): Omit<QuizResult, 'name' | 'organisation' | 'quiz' | 'answers' | 'activeQuestions'> {
  const categoryScores: Record<string, { correct: number; total: number }> = {};
  for (const cat of CATEGORIES) categoryScores[cat] = { correct: 0, total: 0 };

  let correct = 0;
  const activeQuestions = ALL_QUESTIONS.filter(q => activeIds.includes(q.id));

  for (const q of activeQuestions) {
    categoryScores[q.category].total++;
    const answer = answers[q.id];
    if (!answer) continue;

    let ok = false;
    if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
      ok = answer === q.correctLetter;
    } else if (q.type === 'Fill in the Blank') {
      const u = String(answer).trim().toLowerCase().replace(/['"]/g, '');
      const c = (q.correctAnswer || '').trim().toLowerCase().replace(/['"]/g, '');
      ok = u === c;
    } else if (q.type === 'Drag to Order') {
      const uo = answer as string[];
      const co = q.orderedSteps || [];
      ok = uo.length === co.length && uo.every((s, i) => s === co[i]);
    }

    if (ok) { correct++; categoryScores[q.category].correct++; }
  }

  // Weakest category (only among categories that had questions this round)
  let weakest = '';
  let worstPct = Infinity;
  for (const [cat, s] of Object.entries(categoryScores)) {
    if (s.total === 0) continue;
    const p = s.correct / s.total;
    if (p < worstPct) { worstPct = p; weakest = cat; }
  }

  return {
    score: correct,
    total: QUESTIONS_PER_QUIZ,
    passed: correct / QUESTIONS_PER_QUIZ >= PASS_MARK,
    categoryScores,
    weakestCategory: weakest,
  };
}

export default function QuizApp() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<typeof ALL_QUESTIONS>([]);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = useCallback((n: string, org: string) => {
    setName(n);
    setOrganisation(org);
    setAnswers({});
    setResult(null);
    setActiveQuestions(pickQuestions());
    setScreen('quiz');
  }, []);

  const submitQuiz = useCallback(async (finalAnswers: UserAnswers) => {
    const activeIds = activeQuestions.map(q => q.id);
    const graded = gradeAnswers(finalAnswers, activeIds);
    const pct = Math.round((graded.score / graded.total) * 100);

    const quizResult: QuizResult = {
      name,
      organisation,
      quiz: QUIZ_NAME,
      answers: finalAnswers,
      activeQuestions: activeIds,
      ...graded,
    };
    setResult(quizResult);
    setAnswers(finalAnswers);
    setScreen('results');

    // Save to shared database — shape must match Basics quiz
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz:      QUIZ_NAME,
          name,
          org:       organisation,
          score:     graded.score,
          total:     graded.total,
          pct,
          passed:    graded.passed,
          catScores: graded.categoryScores,
          ts:        new Date().toISOString(),
        }),
      });
    } catch {
      // silently fail — result already shown to user
    }
  }, [name, organisation, activeQuestions]);

  const retake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setActiveQuestions(pickQuestions());
    setScreen('quiz');
  }, []);

  const goHome = useCallback(() => setScreen('landing'), []);

  if (screen === 'admin')   return <AdminScreen onBack={goHome} />;
  if (screen === 'results' && result)
    return <ResultsScreen result={result} onRetake={retake} onHome={goHome} />;
  if (screen === 'quiz')
    return <QuizScreen
      onSubmit={submitQuiz}
      onHome={goHome}
      userName={name}
      questions={activeQuestions}
    />;

  return <LandingScreen onStart={startQuiz} onAdmin={() => setScreen('admin')} />;
}
