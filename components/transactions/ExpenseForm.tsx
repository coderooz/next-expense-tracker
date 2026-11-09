'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import type { Expense, DraftExpense, ExpenseType } from '@/types/expenses.types';
import { categories, CategoryType } from '@/constants/categories.constants';
import { isoToday } from '@/lib/date';
import { useApp } from '@/context/AppContext';

interface ExpenseFormProps {
  initialData?: Expense | null;
  mode: 'create' | 'edit';
  onSubmit: (draft: DraftExpense) => Promise<void>;
}

export function ExpenseForm({ initialData, mode, onSubmit }: ExpenseFormProps) {
  const router = useRouter();
  const { showToast } = useApp();

  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '');
  const [category, setCategory] = useState<CategoryType>(
    (initialData?.category as CategoryType) || 'Food & dining'
  );
  const [date, setDate] = useState(initialData?.date || isoToday());
  const [type, setType] = useState<ExpenseType>(initialData?.type || 'Expense');
  const [payment, setPayment] = useState(
    initialData?.payment || initialData?.paymentMethod || 'UPI'
  );
  const [note, setNote] = useState(initialData?.note || initialData?.description || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a transaction title.');
      return;
    }
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please provide an amount greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        amount: parsedAmount,
        category: type === 'Income' ? 'Income' : category,
        date,
        type,
        payment,
        paymentMethod: payment,
        note,
        description: note,
      });

      showToast(
        mode === 'create'
          ? 'Transaction recorded successfully!'
          : 'Transaction updated successfully!',
        'success'
      );
      router.push('/expenses');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Back button & Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#788591] hover:text-[#237a61] transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Transactions</span>
        </Link>
      </div>

      <div className="bg-white border border-[#e8edef] rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-6 border-b border-[#f0f4f5] pb-4">
          <span className="eyebrow">
            {mode === 'create' ? 'NEW TRANSACTION' : 'UPDATE TRANSACTION'}
          </span>
          <h1 className="text-xl font-bold text-[#202b37] tracking-tight mt-1">
            {mode === 'create' ? 'Record an Expense or Income' : 'Edit Transaction'}
          </h1>
          <p className="text-xs text-[#788591] mt-0.5">
            Fill in the details below to keep your financial ledger organized.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Switcher */}
          <div className="type-switch mb-4">
            <button
              type="button"
              className={type === 'Expense' ? 'selected expense-selected' : ''}
              onClick={() => {
                setType('Expense');
                if (category === 'Income') setCategory('Food & dining');
              }}
            >
              Expense
            </button>
            <button
              type="button"
              className={type === 'Income' ? 'selected income-selected' : ''}
              onClick={() => {
                setType('Income');
                setCategory('Income');
              }}
            >
              Income
            </button>
          </div>

          {/* Title */}
          <label className="form-field">
            <span>Title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flight tickets to Mumbai, Groceries, Salary"
              required
            />
          </label>

          {/* Amount and Date */}
          <div className="form-grid">
            <label className="form-field">
              <span>Amount</span>
              <div className="amount-input">
                <b>₹</b>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </label>
            <label className="form-field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>

          {/* Category and Payment Method */}
          <div className="form-grid">
            <label className="form-field">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                disabled={type === 'Income'}
              >
                {categories
                  .filter((c) =>
                    type === 'Income' ? c === 'Income' : c !== 'Income'
                  )
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </label>
            <label className="form-field">
              <span>Payment Method</span>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank transfer">Bank transfer</option>
              </select>
            </label>
          </div>

          {/* Note / Description */}
          <label className="form-field">
            <span>
              Notes <small>Optional</small>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add optional notes, receipt details, or tags..."
              rows={3}
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0f4f5]">
            <Link
              href="/expenses"
              className="button button-ghost"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={16} />
                  <span>{mode === 'create' ? 'Create Transaction' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
