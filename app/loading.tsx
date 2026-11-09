import React from 'react';
import { Wallet } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#f5f7f8] flex flex-col items-center justify-center">
      <div className="h-12 w-12 rounded-2xl bg-[#237a61] text-white flex items-center justify-center shadow-lg shadow-[#237a6126] animate-bounce mb-4">
        <Wallet size={24} />
      </div>
      <p className="text-xs font-semibold text-[#788591]">
        Loading Pennywise…
      </p>
    </div>
  );
}
