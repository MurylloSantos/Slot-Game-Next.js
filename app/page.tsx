'use client'; // Enables client-side interactivity in this file

import { useState, useEffect } from 'react';

export default function Home() {
  // State to store user's current credits
  const [credits, setCredits] = useState<number | null>(null);

  // State to manage loading state while waiting for server response
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* App title */}
      <h1 className="text-2xl font-bold mb-4">🎰 Slot Machine Game</h1>

      {/* Start Game Button */}
      <button
        onClick={startGame}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? 'Starting...' : 'Start Game'}
      </button>

      {/* Show credits if game has started */}
      {credits !== null && (
        <p className="mt-4 text-lg">You have {credits} credits.</p>
      )}
    </main>
  );
}
