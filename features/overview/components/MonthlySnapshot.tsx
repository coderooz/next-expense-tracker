'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { money } from '@/lib/currency';

interface MonthlySnapshotProps {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
}

export function MonthlySnapshot({
  balance = 0,
  income = 0,
  expenses = 0,
  savingsRate = 0,
}: Partial<MonthlySnapshotProps>) {
  return (
    <article className="panel insight-panel">
      <div className="panel-header">
        <div>
          <h2>Monthly snapshot</h2>
          <p>Your progress at a glance</p>
        </div>
        <span className="snapshot-icon">
          <Sparkles size={17} />
        </span>
      </div>
      <div className="snapshot-highlight">
        <span>Available to save</span>
        <strong>{money(balance)}</strong>
        <small>Based on your recorded income and expenses</small>
      </div>
      <div className="snapshot-row">
        <span>Income</span>
        <strong>{money(income)}</strong>
      </div>
      <div className="snapshot-row">
        <span>Expenses</span>
        <strong>{money(expenses)}</strong>
      </div>
      <div className="snapshot-row">
        <span>Savings rate</span>
        <strong className="positive-text">{savingsRate}%</strong>
      </div>
      <div className="snapshot-footer">
        <span className="snapshot-check">
          <Check size={13} />
        </span>{' '}
        <span>You’re building a healthy habit.</span>
      </div>
    </article>
  );
}

export default MonthlySnapshot;
