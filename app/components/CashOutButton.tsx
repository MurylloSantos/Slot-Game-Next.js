'use client';

import { useState, useEffect } from 'react';

type Props = {
  // Callback function to pass final credits back to parent component after cashing out
  onCashOut: (finalCredits: number) => void;
};

export function CashOutButton({ onCashOut }: Props) {
  // Track whether the button is temporarily disabled (due to hover behavior)
  const [disabled, setDisabled] = useState(false);

  // Track the current x/y position of the button on screen
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // On initial mount, place the button near the center of the screen
  useEffect(() => {
    setPos({
      x: window.innerWidth - 200, 
      y: window.innerHeight - 100, 
    });

    // Handle window resize to keep button within visible screen
    const handleResize = () => {
      setPos((pos) => ({
        x: Math.min(pos.x, window.innerWidth - 150),
        y: Math.min(pos.y, window.innerHeight - 50),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Handle hover behavior:
   * - 50% chance: move button to a new random position
   * - 40% chance: disable button temporarily for 2 seconds
   */
  const handleMouseEnter = () => {
    const rand = Math.random();

    if (rand < 0.5) {
      // Move to a random location within viewport boundaries
      const newX = Math.random() * (window.innerWidth - 150);
      const newY = Math.random() * (window.innerHeight - 50);
      setPos({ x: newX, y: newY });
    } else if (rand < 0.9) {
      // Temporarily disable the button
      setDisabled(true);
      setTimeout(() => setDisabled(false), 2000);
    }
  };

  /**
   * Call the server-side /api/cashout endpoint to end session
   * and receive final credit count.
   */
  const handleClick = async () => {
    if (disabled) return; // Prevent clicking while disabled

    try {
      const res = await fetch('/api/cashout', { method: 'POST' });
      const data = await res.json();
      onCashOut(data.credits); // Pass back final credits to parent component
    } catch (err) {
      console.error('Cash out failed', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      style={{
        // Floating fixed-position button
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,

        // Visual styling
        padding: '12px 24px',
        backgroundColor: disabled ? '#94a3b8' : '#2563eb', // grey if disabled, blue otherwise
        color: disabled ? '#cbd5e1' : 'white',
        borderRadius: '12px',
        boxShadow: disabled
          ? 'none'
          : '0 4px 12px rgba(37, 99, 235, 0.6)', // blue glow if active
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        fontWeight: '600',
        fontSize: '1.1rem',
        userSelect: 'none',

        // Smooth animation
        transition: 'left 0.4s ease, top 0.4s ease, background-color 0.3s ease',
      }}
      title={disabled ? 'Temporarily unavailable' : 'Cash Out'}
      aria-disabled={disabled}
    >
      💰 CASH OUT
    </button>
  );
}
