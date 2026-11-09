'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-[#e8edef] rounded-2xl shadow-sm p-8 flex flex-col items-center">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle size={26} />
        </div>
        <h2 className="text-lg font-bold text-[#202b37] mb-2">
          Something went wrong
        </h2>
        <p className="text-xs text-[#788591] mb-6 leading-relaxed">
          An unexpected error occurred while processing your request. Please try again or return to the dashboard.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="button button-primary flex items-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
