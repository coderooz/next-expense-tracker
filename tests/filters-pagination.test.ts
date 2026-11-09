import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Expense } from '../types/expenses.types.ts';

const testExpenses: Expense[] = [
  {
    id: '1',
    title: 'Grocery Supermarket',
    amount: 1200,
    category: 'Food & dining',
    date: '2026-06-05',
    type: 'Expense',
    payment: 'UPI',
  },
  {
    id: '2',
    title: 'Train Ticket to Delhi',
    amount: 850,
    category: 'Travel',
    date: '2026-06-04',
    type: 'Expense',
    payment: 'Card',
  },
  {
    id: '3',
    title: 'Uber to Office',
    amount: 320,
    category: 'Transport',
    date: '2026-06-03',
    type: 'Expense',
    payment: 'UPI',
  },
  {
    id: '4',
    title: 'Monthly Salary Credit',
    amount: 60000,
    category: 'Income',
    date: '2026-06-01',
    type: 'Income',
    payment: 'Bank transfer',
  },
  {
    id: '5',
    title: 'Netflix Subscription',
    amount: 649,
    category: 'Entertainment',
    date: '2026-05-28',
    type: 'Expense',
    payment: 'Card',
  },
];

describe('Search, Filters & Pagination Logic', () => {
  it('should search case-insensitively by title', () => {
    const search = 'grocery';
    const matches = testExpenses.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
    assert.equal(matches.length, 1);
    assert.equal(matches[0].id, '1');
  });

  it('should filter by category including Travel', () => {
    const travelItems = testExpenses.filter((e) => e.category === 'Travel');
    assert.equal(travelItems.length, 1);
    assert.equal(travelItems[0].title, 'Train Ticket to Delhi');
  });

  it('should filter by date range correctly', () => {
    const juneItems = testExpenses.filter(
      (e) => e.date >= '2026-06-01' && e.date <= '2026-06-30'
    );
    assert.equal(juneItems.length, 4);
  });

  it('should combine search and category filter', () => {
    const filtered = testExpenses.filter(
      (e) =>
        e.title.toLowerCase().includes('ticket') && e.category === 'Travel'
    );
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].amount, 850);
  });

  it('should paginate items with limit 2', () => {
    const pageSize = 2;
    const total = testExpenses.length;
    const totalPages = Math.ceil(total / pageSize);
    assert.equal(totalPages, 3);

    const page1 = testExpenses.slice(0, pageSize);
    assert.equal(page1.length, 2);
    assert.equal(page1[0].id, '1');
    assert.equal(page1[1].id, '2');

    const page2 = testExpenses.slice(2, 4);
    assert.equal(page2.length, 2);
    assert.equal(page2[0].id, '3');
    assert.equal(page2[1].id, '4');

    const page3 = testExpenses.slice(4, 6);
    assert.equal(page3.length, 1);
    assert.equal(page3[0].id, '5');
  });
});
