// /app/api/cashout/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '@/lib/sessionStore'; // Use helper functions for session access
import { getUser, addCredits } from '@/lib/userStore'; // Use helper functions for user access

export async function POST() {
  // Read session ID from the request cookie
  const sessionId = (await cookies()).get('session-id')?.value;
  const userId = (await cookies()).get('user-id')?.value;

  // Validate session and user existence
  if (!sessionId || !userId) {
    return NextResponse.json({ error: 'No session or user found in cookies' }, { status: 400 });
  }

  const session = getSession(sessionId);
  const user = getUser(userId);
  
  if (!session || !user) {
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
