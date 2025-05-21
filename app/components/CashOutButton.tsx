'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

type Props = {
  // Callback function to pass final credits back to parent component after cashing out
  onCashOut: (finalCredits: number) => void,
  setTotalCredits: (totalCredits: number) => void,
  isRolling?: boolean; // needed to disable button during rolling to prevent unexpected errors
};

export function CashOutButton({ onCashOut, setTotalCredits, isRolling = false }: Props) {
  // Track whether the button is temporarily disabled (due to hover behavior)
  const [disabled, setDisabled] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const disableDecision = isRolling || disabled;

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
    if (isCashingOut || disableDecision) return;

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
    if (disableDecision) return; // Prevent clicking while disableDecision
    setIsCashingOut(true); // Start cashing

    try {
      const res = await fetch('/api/cashout', { method: 'POST' });
      const data = await res.json();
      console.log('cashing out', data)
      toast.success(`💰 You cashed out with ${data.cashedOutCredits} credits!`);
      setTotalCredits(data.totalCredits);
      onCashOut(data.credits); // Pass back final credits to parent component
    } catch (err: any) {
      toast.error(err.message || 'Cash out failed');
    } finally {
      setIsCashingOut(false); // Stop cashing out
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disableDecision}
      style={{
        // Floating fixed-position button
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 1000,

        // Visual styling
        padding: '12px 24px',
        backgroundColor: disableDecision ? '#94a3b8' : '#2563eb', // grey if disabled, blue otherwise
        color: disableDecision ? '#cbd5e1' : 'white',
        borderRadius: '12px',
        boxShadow: disableDecision
          ? 'none'
          : '0 4px 12px rgba(37, 99, 235, 0.6)', // blue glow if active
        cursor: disableDecision ? 'not-allowed' : 'pointer',
        opacity: disableDecision ? 0.7 : 1,
        fontWeight: '600',
        fontSize: '1.1rem',
        userSelect: 'none',

        // Smooth animation
        transition: 'left 0.4s ease, top 0.4s ease, background-color 0.3s ease',
      }}
      title={disableDecision ? 'Temporarily unavailable' : 'Cash Out'}
      aria-disabled={disableDecision}
    >
      {isCashingOut ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          Processing...
        </span>
      ) : (
        '💰 CASH OUT'
      )}
    </button>
  );
}
