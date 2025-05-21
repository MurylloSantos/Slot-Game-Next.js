import { cookies } from 'next/headers';
import { getSession, sessions } from '@/lib/sessionStore';
import { NextResponse } from 'next/server';
import { createUser, getUser, users } from '@/lib/userStore';

/**
 * GET /api/session
 * Reads user-id from cookie and returns current user data (totalCredits)
 */
export async function GET() {
  const sessionId = (await cookies()).get('session-id')?.value;
  const userId = (await cookies()).get('user-id')?.value;

  if(!userId) {
    //user doesn't exist, which means this is new user
    const { id: userId, data: userData } = createUser();
    //return with user-id cookie
    const response = NextResponse.json({ error: 'Session not found', userId: userId }, { status: 404 });
    response.cookies.set('user-id', userId, {
        httpOnly: true,   // Prevents JS access to cookie (security)
        path: '/',        // Cookie is accessible across all routes
        sameSite: 'lax',  // Protects against CSRF
        maxAge: 60 * 60 * 24, // 1 day session persistence
    });
    return response;
  }

  const user = getUser(userId);
  if(!user) {
    //Invalid userId, create a new User
    const { id: userId, data: userData } = createUser();
    //return with user-id cookie
    const response = NextResponse.json({ error: 'Session not found', userId: userId }, { status: 404 });
    response.cookies.set('user-id', userId, {
        httpOnly: true,   // Prevents JS access to cookie (security)
        path: '/',        // Cookie is accessible across all routes
        sameSite: 'lax',  // Protects against CSRF
        maxAge: 60 * 60 * 24, // 1 day session persistence
    });
    return response;
  }

  //user exists, check if session exists

  if (!sessionId) {
    return NextResponse.json({ error: 'Session not found', totalCredits: user.totalCredits }, { status: 404 });
  }

  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Invalid session', userId }, { status: 404 });
  }

  return NextResponse.json({ credits: session.credits, totalCredits: user.totalCredits, sessionId, userId });
}
