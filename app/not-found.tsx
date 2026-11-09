import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f7f8] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white border border-[#e8edef] rounded-2xl shadow-sm p-8 flex flex-col items-center">
        <div className="h-12 w-12 rounded-2xl bg-[#e6f3ed] text-[#237a61] flex items-center justify-center mb-4">
          <Wallet size={26} />
        </div>
        <h1 className="text-3xl font-extrabold text-[#202b37] mb-2 font-sans">
          404
        </h1>
        <h2 className="text-sm font-bold text-[#202b37] mb-2">
          Page Not Found
        </h2>
        <p className="text-xs text-[#788591] mb-6 leading-relaxed">
          The page or transaction record you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="button button-primary flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
