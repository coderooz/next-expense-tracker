'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { categoryColors, CategoryType } from '@/constants/categories.constants';
import { CategoryIcon } from '@/components/shared/CategoryIcon';
import { money } from '@/lib/currency';

interface CategoryRow {
  category: CategoryType;
  value: number;
}

interface SpendingBreakdownProps {
  byCategory?: CategoryRow[];
  totalSpend?: number;
}

export function SpendingBreakDown({
  byCategory = [],
  totalSpend = 0,
}: SpendingBreakdownProps) {
  return (
    <article className="panel category-panel">
      <div className="panel-header">
        <div>
          <h2>Spending by category</h2>
          <p>Where your money goes</p>
        </div>
        <button
          type="button"
          className="icon-button subtle-icon"
          aria-label="Category options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="category-total">
        <strong>{money(totalSpend)}</strong>
        <span>Total spent</span>
      </div>
      <div className="category-breakdown">
        {byCategory.slice(0, 5).map((row) => (
          <div className="category-line" key={row.category}>
            <CategoryIcon category={row.category} />
            <div className="category-line-copy">
              <div>
                <strong>{row.category}</strong>
                <span>{money(row.value)}</span>
              </div>
              <div className="progress-track">
                <i
                  className={categoryColors[row.category] || 'slate'}
                  style={{
                    width: `${totalSpend ? (row.value / totalSpend) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default SpendingBreakDown;
