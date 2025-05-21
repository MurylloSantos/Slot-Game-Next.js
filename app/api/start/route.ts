import { NextResponse } from 'next/server';
import { createSession } from '@/lib/sessionStore';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/userStore';

/**
 * POST /api/start
 * Creates a new anonymous game session with 10 credits.
 * Sets a cookie `session-id` to persist session on client side.
 */
export async function POST() {
  const userId = (await cookies()).get('user-id')?.value;
  if(!userId) {
    return NextResponse.json({ error: 'No user found in cookies' }, { status: 400 });
  }
  const user = getUser(userId);
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid user'}, { status: 400 });
  }

  const { id: sessionId, data: sessionData } = createSession(userId);

  // Send session ID back via a cookie so the client can use it on future requests
  const response = NextResponse.json({ credits: sessionData.credits });
  response.cookies.set('session-id', sessionId, {
    httpOnly: true,   // Prevents JS access to cookie (security)
    path: '/',        // Cookie is accessible across all routes
    sameSite: 'lax',  // Protects against CSRF
    maxAge: 60 * 60 * 24, // 1 day session persistence
  });

  return response;
}