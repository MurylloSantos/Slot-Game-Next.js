'use client';

import React from 'react';

// Props for win/loss message
interface MessageBannerProps {
  message: string | null;
}

// Displays a win/loss message
export const MessageBanner: React.FC<MessageBannerProps> = ({ message }) =>
  message ? (
    <div className="mt-4 text-xl font-semibold">
      {message}
    </div>
  ) : null;
