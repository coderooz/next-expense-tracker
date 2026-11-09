'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { categories, categoryColors, CategoryType } from '@/constants/categories.constants';
import PageHeading from '@/components/shared/PageHeading';
import CategoryIcon from '@/components/shared/CategoryIcon';
import { money } from '@/lib/currency';
import { useExpenses } from '@/hooks/useExpenses';
import type { Expense } from '@/types/expenses.types';

const defaultBudgetLimits: Record<string, number> = {
  'Food & dining': 15000,
  Transport: 8000,
  Travel: 25000,
  Shopping: 10000,
  'Bills & utilities': 7000,
  Entertainment: 5000,
  Health: 6000,
  Education: 12000,
  Other: 5000,
};

export function CategoriesView({
  transactions: propTransactions,
}: {
  transactions?: Expense[];
}) {
  const { expenses: fetchedTransactions } = useExpenses({ limit: 100 });
  const transactions = propTransactions || fetchedTransactions;

  return (
    <>
      <PageHeading
        eyebrow="BUDGETS & CATEGORIES"
        title="Category Insights"
        description="Understand your spending distribution and keep budget thresholds in view."
      />
      <div className="category-card-grid">
        {categories
          .filter((c) => c !== 'Income')
          .map((category) => {
            const spent = transactions
              .filter((t) => t.type === 'Expense' && t.category === category)
              .reduce((sum, t) => sum + t.amount, 0);
            const limit = defaultBudgetLimits[category] || 10000;
            const percent = Math.min(100, (spent / limit) * 100);

            return (
              <article className="panel budget-card" key={category}>
                <div className="budget-card-top">
                  <CategoryIcon category={category} size={18} />
                  <button
                    type="button"
                    className="icon-button subtle-icon"
                    aria-label={`More about ${category}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <h2>{category}</h2>
                <div className="budget-amount">
                  <strong>{money(spent)}</strong>
                  <span>of {money(limit)}</span>
                </div>
                <div className="progress-track budget-progress">
                  <i
                    className={categoryColors[category as CategoryType] || 'slate'}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="budget-caption">
                  <span>{Math.round(percent)}% used</span>
                  <span className={percent > 90 ? 'warning-text' : ''}>
                    {money(Math.max(0, limit - spent))} remaining
                  </span>
                </div>
              </article>
            );
          })}
      </div>
    </>
  );
}

export default CategoriesView;
