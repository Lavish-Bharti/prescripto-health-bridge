import React from 'react';

export default function LoadingSpinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
      {text && <p className="text-sm text-muted animate-pulse">{text}</p>}
    </div>
  );
}