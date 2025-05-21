// app/api/start/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Initialize session with 10 credits
  const session = {
    credits: 10,
  };

  // Simulate saving session in a cookie
  const response = NextResponse.json(session);
  response.cookies.set('slot-session', JSON.stringify(session), {
    httpOnly: true,
    path: '/',
  });

  return response;
}
