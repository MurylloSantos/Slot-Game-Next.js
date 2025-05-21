// /app/api/cashout/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/sessionStore'; // Use helper functions for session access

export async function POST() {
  // Read session ID from the request cookie
  const sessionId = (await cookies()).get('session-id')?.value;

  // If no session ID is found or session doesn't exist, return error
  if (!sessionId) {
    return NextResponse.json({ error: 'No session found in cookies' }, { status: 400 });
  }

  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired session' + ' ' + sessionId }, { status: 400 });
  }

  const { credits } = session;

  // Remove the session from in-memory store
  deleteSession(sessionId);

  // Respond with final credits and clear the cookie
  const response = NextResponse.json({ credits });

  // Clear session-id cookie on client
  response.cookies.set('session-id', '', { maxAge: 0 });

  return response;
}
