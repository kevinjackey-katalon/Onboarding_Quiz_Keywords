import { NextRequest, NextResponse } from 'next/server';

// Shared Upstash Redis database — same key and data shape as Onboarding_Quiz_Katalon_Basics
// so both quizzes write to and read from a single unified admin dashboard.
//
// Storage pattern: one JSON array stored at key "katalon_quiz_results" (GET/SET, not lpush/lrange)
// Record shape: { quiz, name, org, score, total, pct, passed, catScores, ts }
//   — matches the Basics quiz exactly so the shared dashboard renders both correctly.

const KEY = 'katalon_quiz_results';

async function upstash(cmd: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/${cmd.join('/')}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.result ?? null;
}

export async function GET() {
  try {
    const raw = await upstash(['GET', KEY]);
    if (raw === null) {
      return NextResponse.json([]);
    }
    const results = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return NextResponse.json(results || []);
  } catch (e) {
    console.error('GET /api/results:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Normalise to the shared record shape
    const record = {
      quiz:      body.quiz      || 'Katalon Keywords Reference Quiz',
      name:      body.name      || 'Unknown',
      org:       body.org       || body.organisation || '',
      score:     body.score,
      total:     body.total,
      pct:       body.pct       ?? Math.round((body.score / body.total) * 100),
      passed:    body.passed,
      catScores: body.catScores || body.categoryScores || {},
      ts:        body.ts        || new Date().toISOString(),
    };

    // Read → append → write
    const raw = await upstash(['GET', KEY]);
    const results = raw ? JSON.parse(raw) : [];
    results.push(record);
    await upstash(['SET', KEY, JSON.stringify(results)]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/results:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.password !== 'KatalonTrue') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await upstash(['DEL', KEY]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/results:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
