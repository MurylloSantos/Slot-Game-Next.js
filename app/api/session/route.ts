import { cookies } from 'next/headers';
import { getSession } from '@/lib/sessionStore';
import { NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/userStore';
import { getSessionAndUser } from '@/lib/context';

/**
 * GET /api/session
 * Reads user-id from cookie and returns current user data (totalCredits)
 */
export async function GET() {
  const { session, user, sessionId, userId, setCookies } = await getSessionAndUser();

  if (!session || !user) {
    const response = NextResponse.json({ error: 'Session not found', totalCredits: user?.totalCredits }, { status: 404 });
    return setCookies(response);
  }

  const response = NextResponse.json({ credits: session.credits, totalCredits: user.totalCredits, sessionId, userId });
  return setCookies(response);
}
