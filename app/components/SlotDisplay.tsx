'use client';

import React from 'react';

// Props for SlotDisplay component
interface SlotDisplayProps {
  symbols: string[];
}

// Shows the 3 slot symbols
export const SlotDisplay: React.FC<SlotDisplayProps> = ({ symbols }) => {
  return (
    <div className="flex justify-center gap-6 text-6xl mt-4">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          className="w-24 h-24 flex items-center justify-center border-4 border-black bg-white rounded-xl shadow-lg"
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};
