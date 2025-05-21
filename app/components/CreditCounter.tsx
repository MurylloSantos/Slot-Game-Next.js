'use client';

import React from 'react';

// Props for CreditCounter
interface CreditCounterProps {
  credits: number;
}

// Displays how many credits the user has
export const CreditCounter: React.FC<CreditCounterProps> = ({ credits }) => (
  <p className="text-lg">You have {credits} credits.</p>
);
