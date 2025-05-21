// /app/api/cashout/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/sessionStore'; // Use helper functions for session access
import { getUser, addCredits } from '@/lib/userStore'; // Use helper functions for user access
import { getSessionAndUser } from '@/lib/context';

export async function POST() {
  const { session, user, sessionId, userId, setCookies } = await getSessionAndUser();
  
  if (!session || !sessionId || !user || !userId) {
    return NextResponse.json({ error: 'Invalid session or user'}, { status: 400 });
  }

  const { credits } = session;
  // Add session credits to user's total credits
  addCredits(userId, credits);

  // Remove the session from in-memory store
  deleteSession(sessionId);

  // Prepare response with final credits info
  const response = NextResponse.json({
    cashedOutCredits: credits,
    totalCredits: user.totalCredits,
  });

  // Clear session-id cookie on client
  response.cookies.set('session-id', '', { maxAge: 0 });

  return response;
}
