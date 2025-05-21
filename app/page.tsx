'use client'; // Enables client-side interactivity in this file

import { useState, useEffect } from 'react';

// List of possible symbols (used for loading state)
const symbols = ['🍒', '🍋', '🍊', '🍉']; // Cherry, Lemon, Orange, Watermelon

export default function Home() {
  // State to store user's current credits
  const [credits, setCredits] = useState<number | null>(null);
  
  // Track symbols currently shown in the slot blocks
  const [slots, setSlots] = useState<string[]>(['❓', '❓', '❓']);

  // Track loading states for Start Game and Rolling
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);

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
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Starting...' : 'Start Game'}
        </button>
      )}

      {/* Show credits if game has started */}
      {credits !== null && (
        <>
          <p className="text-lg">You have {credits} credits.</p>

          {/* Slot blocks */}
          <div className="flex justify-center gap-6 text-6xl mt-4">
            {slots.map((symbol, index) => (
              <div
                key={index}
                className="w-24 h-24 flex items-center justify-center border-4 border-black bg-white rounded-xl shadow-lg"
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* ROLL button */}
          <button
            onClick={handleRoll}
            disabled={spinning || credits < 1}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {spinning ? 'Spinning...' : 'ROLL'}
          </button>
        </>
      )}
    </main>
  );
}
