import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export interface QuizResult {
  id: string;
  name: string;
  organisation: string;
  score: number;
  total: number;
  passed: boolean;
  date: string;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
}

export async function GET() {
  try {
    const results = await kv.lrange<QuizResult>('quiz_results', 0, -1);
    return NextResponse.json({ results: results || [] });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result: QuizResult = {
      id: Date.now().toString(),
      name: body.name,
      organisation: body.organisation || '',
      score: body.score,
      total: body.total,
      passed: body.passed,
      date: new Date().toISOString(),
      categoryScores: body.categoryScores,
      weakestCategory: body.weakestCategory,
    };
    await kv.lpush('quiz_results', result);
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.password !== 'KatalonTrue') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await kv.del('quiz_results');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
