'use client';

import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  ReceiptText,
  PieChart,
} from 'lucide-react';
import { categories, categoryColors, CategoryType } from '@/constants/categories.constants';
import PageHeading from '@/components/shared/PageHeading';
import StatCard from '@/components/shared/StatCard';
import { money } from '@/lib/currency';
import { useExpenses } from '@/hooks/useExpenses';
import type { Expense } from '@/types/expenses.types';

export function ReportsView({
  transactions: propTransactions,
  income: propIncome,
  expenses: propExpenses,
}: {
  transactions?: Expense[];
  income?: number;
  expenses?: number;
}) {
  const { expenses: fetchedTransactions, summary } = useExpenses({ limit: 100 });

  const transactions = propTransactions || fetchedTransactions;
  const income = propIncome !== undefined ? propIncome : summary.totalIncome;
  const expenses = propExpenses !== undefined ? propExpenses : summary.totalExpenses;
  const netSavings = income - expenses;

  const groups = categories
    .filter((c) => c !== 'Income')
    .map((category) => ({
      category,
      total: transactions
        .filter((t) => t.type === 'Expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <PageHeading
        eyebrow="FINANCIAL REPORTS"
        title="Spending & Cash Flow Reports"
        description="A comprehensive picture of your income, expenses, and category distributions."
      />

      <div className="stat-grid report-stats">
        <StatCard
          label="Total income"
          value={money(income)}
          trend="+Earned"
          note="all recorded transactions"
          icon={<ArrowDownRight size={18} />}
          tone="blue"
        />
        <StatCard
          label="Total expenses"
          value={money(expenses)}
          trend="−Spent"
          note="all recorded expenses"
          icon={<ArrowUpRight size={18} />}
          tone="orange"
        />
        <StatCard
          label="Net savings"
          value={money(netSavings)}
          trend={netSavings >= 0 ? '+Surplus' : '−Deficit'}
          note="net balance"
          icon={<TrendingUp size={18} />}
          tone="green"
        />
        <StatCard
          label="Transactions"
          value={String(transactions.length)}
          trend="Active"
          note="in your ledger"
          icon={<ReceiptText size={18} />}
          tone="violet"
        />
      </div>

      <section className="panel report-panel">
        <div className="panel-header">
          <div>
            <h2>Expense breakdown by category</h2>
            <p>Compare spending allocations across all categories</p>
          </div>
          <span className="report-period">All recorded activity</span>
        </div>

        {groups.map((row) => (
          <div className="report-category" key={row.category}>
            <div className="report-category-head">
              <span className="flex items-center gap-2">
                <i className={`legend-dot ${categoryColors[row.category as CategoryType] || 'slate'}`} />
                {row.category}
              </span>
              <strong>{money(row.total)}</strong>
            </div>
            <div className="progress-track">
              <i
                className={categoryColors[row.category as CategoryType] || 'slate'}
                style={{
                  width: `${expenses > 0 ? (row.total / expenses) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="empty-state p-12 text-center flex flex-col items-center justify-center">
            <PieChart size={24} className="text-[#9aa5ab] mb-2" />
            <strong className="text-xs font-bold text-[#202b37]">
              No report data yet
            </strong>
            <span className="text-[11px] text-[#788591] mt-0.5">
              Add expenses to visualize your breakdown.
            </span>
          </div>
        )}
      </section>
    </>
  );
}

export default ReportsView;
