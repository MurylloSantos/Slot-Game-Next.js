// lib/context.ts
import { cookies } from 'next/headers';
import { getSession, createSession } from './sessionStore';
import { getUser, createUser } from './userStore';
import { NextResponse } from 'next/server';

export async function getSessionAndUser(createUserIfNotExist = true, createSessionIfNotExist = false) {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session-id')?.value;
  let userId = cookieStore.get('user-id')?.value;

  let user = userId ? getUser(userId) : null;
  let session = sessionId ? getSession(sessionId) : null;

  const newCookies: { key: string, value: string }[] = [];

  // If user is missing or invalid → create a new user
  if (!user && createUserIfNotExist) {
    const { id, data } = createUser();
    user = data;
    userId = id;
    newCookies.push({ key: 'user-id', value: id });
  }

  // If session is missing or invalid → create a new session
  if (!session && createSessionIfNotExist) {
    const { id, data } = createSession(String(userId));
    session = data;
    sessionId = id;
    newCookies.push({ key: 'session-id', value: id });
  }

  return {
    sessionId,
    userId,
    session,
    user,
    setCookies(response: ReturnType<typeof NextResponse.json>) {
      newCookies.forEach(({ key, value }) => {
        response.cookies.set(key, value, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
        });
      });
      return response;
    }
  };
}
