import {users} from '@/data/sessionAndUsers'
/**
 * Get user by ID.
 */
export function getUser(userId: string): User | undefined {
  return users.get(userId);
}

/**
 * Create a new user with 0 totalCredits.
 */
export function createUser(): {id: string, data: User} {
  const user = { totalCredits: 0 };
  const userId = crypto.randomUUID();
  users.set(userId, user);
  console.log('setting new user');
  console.log(users);
  console.log('users set');
  return {id: userId, data: user};
}

/**
 * Add credits to a user's account.
 */
export function addCredits(userId: string, credits: number) {
  const user = users.get(userId);
  if (user) {
    user.totalCredits += credits;
  }
}
