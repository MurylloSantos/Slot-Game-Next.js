import { NextResponse } from 'next/server';
import { createSession } from '@/lib/sessionStore';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/userStore';
import { getSessionAndUser } from '@/lib/context';

/**
 * POST /api/start
 * Creates a new anonymous game session with 10 credits.
 * Sets a cookie `session-id` to persist session on client side.
 */
export async function POST() {
  
  const { session, user, sessionId, userId, setCookies } = await getSessionAndUser(true, true); // create user && session

  // Send session ID back via a cookie so the client can use it on future requests
  const response = NextResponse.json({ credits: session?.credits });

  return setCookies(response);
}