import { NextRequest, NextResponse } from 'next/server';

// Shared Upstash Redis database — same key and data shape as Onboarding_Quiz_Katalon_Basics
// Key: katalon_quiz_results  (single JSON array, GET/SET pattern)
// Shape: { quiz, name, org, score, total, pct, passed, catScores, ts }

const KEY = 'katalon_quiz_results';

function getEnv() {
  return {
    url:   process.env.KV_REST_API_URL   || '',
    token: process.env.KV_REST_API_TOKEN || '',
  };
}

/** Call the Upstash pipeline endpoint — sends commands as JSON body, safe for large values */
async function pipeline(commands: unknown[][]): Promise<unknown[]> {
  const { url, token } = getEnv();
  if (!url || !token) return [];
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  const data: { result: unknown }[] = await res.json();
  return data.map(d => d.result);
}

export async function GET() {
  try {
    const { url, token } = getEnv();
    if (!url || !token) return NextResponse.json([]);
    const [raw] = await pipeline([['GET', KEY]]);
    if (!raw) return NextResponse.json([]);
    const results = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return NextResponse.json(Array.isArray(results) ? results : []);
  } catch (e) {
    console.error('GET /api/results:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, token } = getEnv();
    if (!url || !token) {
      return NextResponse.json({ ok: false, error: 'Redis not configured' }, { status: 500 });
    }

    const body = await req.json();
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

    // Read current list, append, write back — all in one pipeline round-trip
    const [raw] = await pipeline([['GET', KEY]]);
    const results: unknown[] = (raw && typeof raw === 'string') ? JSON.parse(raw) : [];
    results.push(record);
    await pipeline([['SET', KEY, JSON.stringify(results)]]);

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
    await pipeline([['DEL', KEY]]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/results:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
