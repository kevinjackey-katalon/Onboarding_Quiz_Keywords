import { NextRequest, NextResponse } from 'next/server';

export interface QuizResult {
  id: string;
  name: string;
  organisation: string;
  quizName: string;
  score: number;
  total: number;
  passed: boolean;
  date: string;
  categoryScores: Record<string, { correct: number; total: number }>;
  weakestCategory: string;
}

// Upstash Redis via @upstash/redis
// Env vars injected by Vercel when upstash-kj-tracking is connected:
//   KV_REST_API_URL   → https://supreme-moray-97366.upstash.io
//   KV_REST_API_TOKEN → the read/write token
async function getRedis() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  const { Redis } = await import('@upstash/redis');
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

export async function GET() {
  try {
    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json({
        results: [],
        notice: 'Upstash Redis not configured — connect upstash-kj-tracking in Vercel Storage.',
      });
    }
    const results = await redis.lrange<QuizResult>('quiz_results', 0, -1);
    return NextResponse.json({ results: results || [] });
  } catch (e) {
    console.error('GET /api/results:', e);
    return NextResponse.json({ results: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const redis = await getRedis();
    const body = await req.json();
    const result: QuizResult = {
      id: Date.now().toString(),
      name: body.name || 'Unknown',
      organisation: body.organisation || '',
      quizName: body.quizName || 'Katalon Keywords & Advanced Quiz',
      score: body.score,
      total: body.total,
      passed: body.passed,
      date: new Date().toISOString(),
      categoryScores: body.categoryScores || {},
      weakestCategory: body.weakestCategory || '',
    };
    if (redis) await redis.lpush('quiz_results', result);
    return NextResponse.json({ success: true, stored: !!redis });
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
    const redis = await getRedis();
    if (redis) await redis.del('quiz_results');
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/results:', e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
