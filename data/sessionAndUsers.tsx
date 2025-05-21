//Type representing the signle game session
export type Session = {
  credits: number, // Number of credits the user currently has, init: 10,
  userId: string // userId who is using this session
};

export type User = {
  totalCredits: number;
};

globalThis._sessions ??= new Map<string, Session>();
globalThis._users ??= new Map<string, User>();

export const sessions = globalThis._sessions as Map<string, Session>;
export const users = globalThis._users as Map<string, User>;