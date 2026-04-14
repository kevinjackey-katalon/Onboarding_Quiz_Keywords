import { NextRequest, NextResponse } from 'next/server';

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

// Lazy-load KV so the build & quiz work even before a KV store is linked in Vercel
async function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  const { kv } = await import('@vercel/kv');
  return kv;
}

export async function GET() {
  try {
    const kv = await getKV();
    if (!kv) return NextResponse.json({ results: [], notice: 'KV not configured' });
    const results = await kv.lrange<QuizResult>('quiz_results', 0, -1);
    return NextResponse.json({ results: results || [] });
  } catch (e) {
    console.error('GET /api/results:', e);
    return NextResponse.json({ results: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const kv = await getKV();
    const body = await req.json();
    const result: QuizResult = {
      id: Date.now().toString(),
      name: body.name || 'Unknown',
      organisation: body.organisation || '',
      score: body.score,
      total: body.total,
      passed: body.passed,
      date: new Date().toISOString(),
      categoryScores: body.categoryScores || {},
      weakestCategory: body.weakestCategory || '',
    };
    if (kv) await kv.lpush('quiz_results', result);
    return NextResponse.json({ success: true, stored: !!kv });
  } catch (e) {
    console.error('POST /api/results:', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.password !== 'KatalonTrue') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const kv = await getKV();
    if (kv) await kv.del('quiz_results');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/results:', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
