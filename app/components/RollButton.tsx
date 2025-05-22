'use client';

import React from 'react';
import Spinner from './Spinner'

// Props for the RollButton
interface RollButtonProps {
  onClick: () => void;
  spinning: boolean;
  disabled: boolean;
}

// Main ROLL button with state handling
export const RollButton: React.FC<RollButtonProps> = ({
  onClick,
  spinning,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={spinning || disabled}
    className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[100px] h-[44px] gap-2"
  >
    {spinning ? <><Spinner /> Rolling...</> : 'Roll'}
  </button>
);
