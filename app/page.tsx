'use client'; // Enables client-side interactivity in this file

import { useState, useEffect, useRef } from 'react';
import { SlotDisplay } from './components/SlotDisplay';
import { CreditCounter } from './components/CreditCounter';
import { MessageBanner } from './components/MessageBanner';
import { RollButton } from './components/RollButton';
import { CashOutButton } from './components/CashOutButton';

// Each symbol's corresponding reward if matched
const symbolValues: Record<string, number> = {
  '🍒': 10,
  '🍋': 20,
  '🍊': 30,
  '🍉': 40,
};

export default function Home() {
  // State to store user's current credits
  const [credits, setCredits] = useState<number | null>(null);
  
  // Track symbols currently shown in the slot blocks
  const [slots, setSlots] = useState<string[]>(['❓', '❓', '❓']);

  // Track loading states for Start Game and Rolling
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);

  // Win/Loss message shown under slots
  const [message, setMessage] = useState<string | null>(null);

  //Ref to handle message clearing
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current session from server on first load
  // This is useful to keep session state when users refresh their browsers
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        if (!res.ok) return; // No existing session
        const data = await res.json();
        setCredits(data.credits);
      } catch (err) {
        console.error('Failed to fetch session', err);
      }
    };

    fetchSession();
  }, []);

  /**
   * Starts a new game by calling the /api/start endpoint.
   * Sets the returned credits into component state.
   */
  const startGame = async () => {
    setLoading(true); // Disable button while request is in progress
    try {
      const res = await fetch('/api/start', { method: 'POST' }); // Call backend to start session
      const data = await res.json(); // Parse response
      setCredits(data.credits); // Update credit state
    } catch (err) {
      console.error('Failed to start game', err); // Log any errors for debugging
    } finally {
      setLoading(false); // Re-enable button
    }
  };

   /**
   * Rolls the slot machine: triggers server logic, deducts 1 credit,
   * animates slot symbol reveal one by one
   */
  const handleRoll = async () => {
    // Don't allow rolling if spinning, not enough credits, or not ready
    if (spinning || credits === null || credits < 1) return;

    setSpinning(true);
    setMessage(null);
    setSlots(['⏳', '⏳', '⏳']); // Show spinner

    try {
      const res = await fetch('/api/roll', { method: 'POST' });
      const data = await res.json();
      const result = data.result;

      // Reveal each symbol one at a time (1s delay between each)
      setTimeout(() => setSlots([result[0], '⏳', '⏳']), 1000);
      setTimeout(() => setSlots([result[0], result[1], '⏳']), 2000);
      setTimeout(() => {
        setSlots(result);
        setCredits(data.credits); // Update credits

        // Check for win condition (all symbols match)
        if (result[0] === result[1] && result[1] === result[2]) {
          const payout = symbolValues[result[0]];
          setMessage(`🎉 You won ${payout} credits!`);
        } else {
          setMessage('🙁 No match. Try again!');
        }

        // Avoid message from being wiped early by old timeouts
        if (messageTimeoutRef.current) {
          clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
          setMessage(null);
          messageTimeoutRef.current = null;
        }, 5000);

        setSpinning(false);
      }, 3000);
    } catch (err) {
      console.error('Roll failed', err);
      setSpinning(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 gap-6 text-center">
      {/* App title */}
      <h1 className="text-4xl font-bold">🎰 Slot Machine Game</h1>

      {/* Start Game Button */}
      {credits === null && (
        <button
          onClick={startGame}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Starting...' : 'Start Session'}
        </button>
      )}

      {/* Show credits if game has started */}
      {credits !== null && (
        <>
          {/* Show how many credits the user has */}
          <CreditCounter credits={credits} />

          {/* Show slot result (❓ during initial state or ⏳ while loading) */}
          <SlotDisplay symbols={slots} />

          {/* Main ROLL button */}
          <RollButton
            onClick={handleRoll}
            spinning={spinning}
            disabled={credits < 1}
          />

          {/* Cash Out Button */}
          <CashOutButton
            onCashOut={(finalCredits) => {
              setCredits(null); // End session
              setSlots(['❓', '❓', '❓']); // Reset UI
            }}
            isRolling={spinning}
          />

          {/* Win/loss message */}
          <MessageBanner message={message} />
        </>
      )}
    </main>
  );
}
