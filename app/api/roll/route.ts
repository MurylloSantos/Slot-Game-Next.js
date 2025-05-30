import { NextResponse } from 'next/server';
import { getSessionAndUser } from '@/lib/context';

// Possible symbols and their corresponding payouts
const symbols = ['🍒', '🍋', '🍊', '🍉'] as const;
const payouts = {
  '🍒': 10,
  '🍋': 20,
  '🍊': 30,
  '🍉': 40,
};

/**
 * Utility to get a random symbol from the available list
 */
function randomSymbol(): typeof symbols[number] {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

/**
 * Re-roll to a losing combination if cheating is triggered
 * Call this function if we want the house always wins
 */
function rerollToLose(): [string, string, string] {
  let a = randomSymbol();
  let b = randomSymbol();
  while (b === a) b = randomSymbol();
  let c = randomSymbol();
  while (c === a || c === b) c = randomSymbol();
  return [a, b, c];
}

/**
 * POST /api/roll
 * Deducts a credit, rolls slots, applies win/cheat logic, updates session.
 */
export async function POST() {
  const { session, user, sessionId, userId, setCookies } = await getSessionAndUser();

  if(!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  // Not enough credits to play
  if (session.credits < 1) {
    return NextResponse.json({ error: 'Not enough credits' }, { status: 400 });
  }

  // Deduct 1 credit for roll
  session.credits--;

  // Initial random roll
  let result: [string, string, string] = [
    randomSymbol(),
    randomSymbol(),
    randomSymbol(),
  ];

  // Check if the result is a win (all symbols are the same)
  const isWinning = (result[0] === result[1] && result[1] === result[2]);

  // Determine if cheating should happen
  const credits = session.credits;
  const shouldCheat =
    (credits >= 40 && credits <= 60 && isWinning && Math.random() < 0.3) ||
    (credits > 60 && isWinning && Math.random() < 0.6);

  // If we should cheat, reroll into a losing combo
  if (shouldCheat) {
    //result = rerollToLose(); // Call this function if we want the house always wins
    result = [
        randomSymbol(),
        randomSymbol(),
        randomSymbol(),
    ];
  }

  // Check again if it's a win after possible cheating
  const isFinalWin = result[0] === result[1] && result[1] === result[2];

  if (isFinalWin) {
    const payout = payouts[result[0] as keyof typeof payouts];
    session.credits += payout;
  }
  
  return NextResponse.json({
    result,
    credits: session.credits,
  });
}
