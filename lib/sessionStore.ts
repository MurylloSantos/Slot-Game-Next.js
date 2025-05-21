import {sessions} from '@/data/sessionAndUsers'

/**
 * Creates a new session with 10 starting credits.
 * Returns the session ID and initial session data.
 */
export function createSession(userId: string): { id: string; data: Session } {
  const id = crypto.randomUUID(); // Unique session ID
  const data = { credits: 10, userId }; // Initial credit balance
  sessions.set(id, data); // Store session in memory
  return { id, data };
}

/**
 * Retrieves session data by ID.
 * Returns null if the session does not exist.
 */
export function getSession(id: string): Session | null {
  return sessions.get(id) ?? null;
}

/**
 * Updates session data for a given session ID.
 * Does nothing if the session does not exist.
 */
export function updateSession(id: string, updates: Partial<Session>) {
  const session = sessions.get(id);
  if (!session) return;
  sessions.set(id, { ...session, ...updates });
}

/**
 * Deletes a session by ID.
 * Used for "cash out" or when user ends the game.
 */
export function deleteSession(id: string) {
  sessions.delete(id);
}
