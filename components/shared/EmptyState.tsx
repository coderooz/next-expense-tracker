import React from 'react';
import { ReceiptText, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No transactions found',
  description = 'Try adjusting your filters or record a new expense to get started.',
  actionLabel = 'Add Expense',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state p-12 text-center flex flex-col items-center justify-center">
      <div className="h-12 w-12 rounded-2xl bg-[#e6f3ed] text-[#237a61] flex items-center justify-center mb-4">
        <ReceiptText size={24} />
      </div>
      <h3 className="text-sm font-bold text-[#202b37] mb-1">{title}</h3>
      <p className="text-xs text-[#788591] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="button button-primary"
        >
          <Plus size={14} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
