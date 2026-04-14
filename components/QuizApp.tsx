'use client';

import { useState, useCallback } from 'react';
import { questions, PASS_MARK, CATEGORIES } from '@/lib/questions';
import type { Question } from '@/lib/questions';
import LandingScreen from './LandingScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';
import AdminScreen from './AdminScreen';

export type Screen = 'landing' | 'quiz' | 'results' | 'admin';

export interface UserAnswers {
  [questionId: number]: string | string[];
}

export interface QuizResult {
  name: string;
  organisation: string;
  quizName: string;
  score: number;
  total: number;
  passed: boolean;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
  answers: UserAnswers;
}

function gradeAnswers(answers: UserAnswers): Omit<QuizResult, 'name' | 'organisation' | 'quizName' | 'answers'> {
  const categoryScores: Record<string, { correct: number; total: number }> = {};

  for (const cat of CATEGORIES) {
    categoryScores[cat] = { correct: 0, total: 0 };
  }

  let correct = 0;

  for (const q of questions) {
    const cat = q.category;
    categoryScores[cat].total++;

    const answer = answers[q.id];
    if (!answer) continue;

    let isCorrect = false;

    if (q.type === 'Multiple Choice' || q.type === 'Spot the Bug') {
      isCorrect = answer === q.correctLetter;
    } else if (q.type === 'Fill in the Blank') {
      const userAns = String(answer).trim().toLowerCase().replace(/['"]/g, '');
      const correctAns = (q.correctAnswer || '').trim().toLowerCase().replace(/['"]/g, '');
      isCorrect = userAns === correctAns;
    } else if (q.type === 'Drag to Order') {
      const userOrder = answer as string[];
      const correctOrder = q.orderedSteps || [];
      isCorrect = userOrder.length === correctOrder.length &&
        userOrder.every((step, idx) => step === correctOrder[idx]);
    }

    if (isCorrect) {
      correct++;
      categoryScores[cat].correct++;
    }
  }

  // Find weakest category
  let weakest = CATEGORIES[0];
  let worstPct = 1;
  for (const [cat, scores] of Object.entries(categoryScores)) {
    if (scores.total === 0) continue;
    const pct = scores.correct / scores.total;
    if (pct < worstPct) {
      worstPct = pct;
      weakest = cat;
    }
  }

  return {
    score: correct,
    total: questions.length,
    passed: correct / questions.length >= PASS_MARK,
    categoryScores,
    weakestCategory: weakest,
  };
}

export default function QuizApp() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [quizName, setQuizName] = useState('');
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = useCallback((n: string, org: string, qn: string) => {
    setName(n);
    setOrganisation(org);
    setQuizName(qn);
    setAnswers({});
    setResult(null);
    setScreen('quiz');
  }, []);

  const submitQuiz = useCallback(async (finalAnswers: UserAnswers) => {
    const graded = gradeAnswers(finalAnswers);
    const quizResult: QuizResult = {
      name,
      organisation,
      quizName,
      answers: finalAnswers,
      ...graded,
    };
    setResult(quizResult);
    setAnswers(finalAnswers);
    setScreen('results');

    // Save to API
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizResult),
      });
    } catch {
      // silently fail
    }
  }, [name, organisation, quizName]);

  const retake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setScreen('quiz');
  }, []);

  const goHome = useCallback(() => {
    setScreen('landing');
  }, []);

  if (screen === 'admin') return <AdminScreen onBack={goHome} />;
  if (screen === 'results' && result) return <ResultsScreen result={result} onRetake={retake} onHome={goHome} />;
  if (screen === 'quiz') return <QuizScreen onSubmit={submitQuiz} onHome={goHome} />;

  return (
    <LandingScreen
      onStart={startQuiz}
      onAdmin={() => setScreen('admin')}
    />
  );
}
