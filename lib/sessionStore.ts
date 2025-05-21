type Session = {
  credits: number;
};

const sessions = new Map<string, Session>();

export function createSession(): { id: string; data: Session } {
  const id = crypto.randomUUID();
  const data = { credits: 10 };
  sessions.set(id, data);
  return { id, data };
}

export function getSession(id: string): Session | null {
  return sessions.get(id) ?? null;
}

export function updateSession(id: string, updates: Partial<Session>) {
  const session = sessions.get(id);
  if (!session) return;
  sessions.set(id, { ...session, ...updates });
}

export function deleteSession(id: string) {
  sessions.delete(id);
}
