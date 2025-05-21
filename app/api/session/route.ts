// app/api/session/route.ts

import { cookies } from 'next/headers';
import { getSession } from '@/lib/sessionStore';
import { NextResponse } from 'next/server';

/**
 * GET /api/session
 * Reads session-id from cookie and returns current session data (credits).
 */
export async function GET() {
  const sessionId = cookies().get('session-id')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
  }

  return NextResponse.json({ credits: session.credits });
}
