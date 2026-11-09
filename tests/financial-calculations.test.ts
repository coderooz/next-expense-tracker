import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinancialSummary,
  calculateCategoryBreakdown,
} from '../features/overview/utils/overview-calculations.ts';
import type { Expense } from '../types/expenses.types.ts';

const mockLedger: Expense[] = [
  {
    id: '1',
    title: 'Salary',
    category: 'Income',
    amount: 50000,
    date: '2026-06-01',
    type: 'Income',
    payment: 'Bank transfer',
  },
  {
    id: '2',
    title: 'Groceries',
    category: 'Food & dining',
    amount: 6000,
    date: '2026-06-02',
    type: 'Expense',
    payment: 'UPI',
  },
  {
    id: '3',
    title: 'Flight to Goa',
    category: 'Travel',
    amount: 14000,
    date: '2026-06-03',
    type: 'Expense',
    payment: 'Card',
  },
];

describe('Financial Aggregations and Category Breakdown', () => {
  it('should accurately calculate income, expenses, balance and savings rate', () => {
    const summary = calculateFinancialSummary(mockLedger);
    assert.equal(summary.income, 50000);
    assert.equal(summary.expenses, 20000);
    assert.equal(summary.balance, 30000);
    // (30000 / 50000) * 100 = 60%
    assert.equal(summary.savingsRate, 60);
  });

  it('should accurately breakdown expenses by category with percentages', () => {
    const breakdown = calculateCategoryBreakdown(mockLedger);
    assert.equal(breakdown.length, 2);

    const travel = breakdown.find((b) => b.category === 'Travel');
    assert.notEqual(travel, undefined);
    assert.equal(travel?.value, 14000);
    // (14000 / 20000) * 100 = 70%
    assert.equal(travel?.percentage, 70);

    const food = breakdown.find((b) => b.category === 'Food & dining');
    assert.notEqual(food, undefined);
    assert.equal(food?.value, 6000);
    // (6000 / 20000) * 100 = 30%
    assert.equal(food?.percentage, 30);
  });

  it('should handle zero income gracefully without division by zero', () => {
    const noIncomeLedger = mockLedger.filter((t) => t.type === 'Expense');
    const summary = calculateFinancialSummary(noIncomeLedger);
    assert.equal(summary.income, 0);
    assert.equal(summary.expenses, 20000);
    assert.equal(summary.balance, -20000);
    assert.equal(summary.savingsRate, 0);
  });
});
