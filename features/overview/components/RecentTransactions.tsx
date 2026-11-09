'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import TransactionList from '@/components/transactions/TransactionList';
import type { Expense } from '@/types/expenses.types';

interface RecentTransactionsProps {
  rows: Expense[];
  onViewAll?: () => void;
  onEdit?: (item: Expense) => void;
}

export function RecentTransactions({
  rows = [],
  onViewAll,
  onEdit,
}: RecentTransactionsProps) {
  return (
    <article className="panel recent-panel">
      <div className="panel-header">
        <div>
          <h2>Recent transactions</h2>
          <p>Your latest money movements</p>
        </div>
        {onViewAll && (
          <button
            type="button"
            className="text-button flex items-center gap-1 text-xs text-[#237a61] font-bold"
            onClick={onViewAll}
          >
            <span>View all</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
      <TransactionList rows={rows} onEdit={onEdit} compact />
    </article>
  );
}

export default RecentTransactions;
