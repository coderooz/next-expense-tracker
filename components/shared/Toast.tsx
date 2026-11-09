'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="toast">
      {type === 'success' && <CheckCircle2 size={16} className="text-[#34d399]" />}
      {type === 'error' && <AlertCircle size={16} className="text-[#f87171]" />}
      {type === 'info' && <Info size={16} className="text-[#60a5fa]" />}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-white/60 hover:text-white transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default Toast;
