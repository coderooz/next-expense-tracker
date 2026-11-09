import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  expenseSchema,
  expenseQuerySchema,
} from '../lib/validations/expense.schema.ts';

describe('Expense CRUD Validation Schema', () => {
  it('should accept a valid expense input with category Travel', () => {
    const input = {
      title: 'Flight to Mumbai',
      amount: 4500,
      category: 'Travel',
      date: '2026-06-15',
      paymentMethod: 'Card',
      type: 'Expense',
      description: 'Conference ticket',
    };
    const res = expenseSchema.safeParse(input);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.title, 'Flight to Mumbai');
      assert.equal(res.data.amount, 4500);
      assert.equal(res.data.category, 'Travel');
    }
  });

  it('should reject non-positive amounts', () => {
    const zeroAmount = {
      title: 'Coffee',
      amount: 0,
      category: 'Food & dining',
      date: '2026-06-15',
    };
    const negativeAmount = {
      title: 'Coffee',
      amount: -150,
      category: 'Food & dining',
      date: '2026-06-15',
    };
    assert.equal(expenseSchema.safeParse(zeroAmount).success, false);
    assert.equal(expenseSchema.safeParse(negativeAmount).success, false);
  });

  it('should reject invalid or unsupported categories', () => {
    const invalidCategory = {
      title: 'Investment',
      amount: 1000,
      category: 'CryptoSpeculation',
      date: '2026-06-15',
    };
    assert.equal(expenseSchema.safeParse(invalidCategory).success, false);
  });

  it('should reject malformed date format', () => {
    const badDate = {
      title: 'Lunch',
      amount: 250,
      category: 'Food & dining',
      date: '15/06/2026', // non YYYY-MM-DD
    };
    assert.equal(expenseSchema.safeParse(badDate).success, false);
  });

  it('should parse and apply defaults for query schema', () => {
    const defaultQuery = expenseQuerySchema.parse({});
    assert.equal(defaultQuery.page, 1);
    assert.equal(defaultQuery.limit, 10);
    assert.equal(defaultQuery.search, '');
    assert.equal(defaultQuery.category, '');
    assert.equal(defaultQuery.type, 'All');
  });

  it('should coerce string numbers for page and limit', () => {
    const query = expenseQuerySchema.parse({
      page: '3',
      limit: '25',
      search: 'uber',
      category: 'Transport',
    });
    assert.equal(query.page, 3);
    assert.equal(query.limit, 25);
    assert.equal(query.search, 'uber');
    assert.equal(query.category, 'Transport');
  });
});
