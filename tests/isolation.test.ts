import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

interface MockExpenseRecord {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

class MockExpenseStore {
  private records: MockExpenseRecord[] = [];

  create(record: MockExpenseRecord): MockExpenseRecord {
    this.records.push({ ...record });
    return record;
  }

  // Mimics: Expense.find({ userId, ... })
  findUserExpenses(userId: string, search?: string, category?: string): MockExpenseRecord[] {
    return this.records.filter((r) => {
      if (r.userId !== userId) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && category !== 'All categories' && r.category !== category) return false;
      return true;
    });
  }

  // Mimics: Expense.findOne({ _id, userId }) for GET /api/expenses/[id]
  findUserExpenseById(id: string, userId: string): MockExpenseRecord | null {
    const record = this.records.find((r) => r._id === id && r.userId === userId);
    return record || null;
  }

  // Mimics: Expense.findOneAndUpdate({ _id, userId }, { ... })
  updateUserExpense(
    id: string,
    userId: string,
    updates: Partial<MockExpenseRecord>
  ): MockExpenseRecord | null {
    const idx = this.records.findIndex((r) => r._id === id && r.userId === userId);
    if (idx === -1) return null; // 404 unauthorized
    this.records[idx] = { ...this.records[idx], ...updates };
    return this.records[idx];
  }

  // Mimics: Expense.findOneAndDelete({ _id, userId })
  deleteUserExpense(id: string, userId: string): boolean {
    const idx = this.records.findIndex((r) => r._id === id && r.userId === userId);
    if (idx === -1) return false; // 404 unauthorized
    this.records.splice(idx, 1);
    return true;
  }

  getRecordById(id: string): MockExpenseRecord | undefined {
    return this.records.find((r) => r._id === id);
  }
}

describe('Multi-Tenant Data Isolation', () => {
  const store = new MockExpenseStore();
  const userA_Id = 'user_aaa_111';
  const userB_Id = 'user_bbb_222';

  const expenseA1 = store.create({
    _id: 'exp_a1',
    userId: userA_Id,
    title: 'Grocery User A',
    amount: 1500,
    category: 'Food & dining',
    date: '2026-06-01',
  });

  const expenseB1 = store.create({
    _id: 'exp_b1',
    userId: userB_Id,
    title: 'Confidential Client Dinner User B',
    amount: 8500,
    category: 'Food & dining',
    date: '2026-06-02',
  });

  it('authenticates user and returns scoped expenses', () => {
    const userARecords = store.findUserExpenses(userA_Id);
    assert.equal(userARecords.length, 1);
    assert.equal(userARecords[0]._id, expenseA1._id);
    assert.equal(userARecords[0].title, 'Grocery User A');
  });

  it('prevents cross-tenant data leaks when reading expenses', () => {
    const userARecords = store.findUserExpenses(userA_Id);
    const leakedUserB = userARecords.find((r) => r._id === expenseB1._id || r.userId === userB_Id);
    assert.equal(leakedUserB, undefined);
  });

  it('rejects updates to expenses owned by other users', () => {
    const updateResult = store.updateUserExpense(expenseB1._id, userA_Id, {
      title: 'Hacked by User A',
      amount: 1,
    });

    assert.equal(updateResult, null);

    const originalBRecord = store.getRecordById(expenseB1._id);
    assert.equal(originalBRecord?.title, 'Confidential Client Dinner User B');
    assert.equal(originalBRecord?.amount, 8500);
  });

  it('rejects deletion of expenses owned by other users', () => {
    const deleteResult = store.deleteUserExpense(expenseB1._id, userA_Id);

    assert.equal(deleteResult, false);

    const recordStillExists = store.getRecordById(expenseB1._id);
    assert.notEqual(recordStillExists, undefined);
    assert.equal(recordStillExists?._id, expenseB1._id);
  });

  it('allows owner to update and delete their own expense', () => {
    const updated = store.updateUserExpense(expenseB1._id, userB_Id, {
      title: 'Updated by User B',
    });
    assert.equal(updated?.title, 'Updated by User B');

    const deleted = store.deleteUserExpense(expenseB1._id, userB_Id);
    assert.equal(deleted, true);

    const recordNowDeleted = store.getRecordById(expenseB1._id);
    assert.equal(recordNowDeleted, undefined);
  });

  it('returns null when querying an expense owned by another user', () => {
    const fetchedResult = store.findUserExpenseById(expenseB1._id, userA_Id);
    assert.equal(fetchedResult, null);
  });

  it('fetches expense by id for the authorized owner', () => {
    const fetchedResult = store.findUserExpenseById(expenseA1._id, userA_Id);
    assert.notEqual(fetchedResult, null);
    assert.equal(fetchedResult?._id, expenseA1._id);
    assert.equal(fetchedResult?.title, 'Grocery User A');
  });
});
