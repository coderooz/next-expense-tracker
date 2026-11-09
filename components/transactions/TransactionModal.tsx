'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Expense, DraftExpense, ExpenseType } from '@/types/expenses.types';
import { categories, CategoryType } from '@/constants/categories.constants';
import { isoToday } from '@/lib/date';

interface TransactionModalProps {
  initial: Expense | null;
  onClose: () => void;
  onSave: (draft: DraftExpense) => Promise<void> | void;
}

export function TransactionModal({
  initial,
  onClose,
  onSave,
}: TransactionModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState<CategoryType>(
    (initial?.category as CategoryType) || 'Food & dining'
  );
  const [date, setDate] = useState(initial?.date || isoToday());
  const [type, setType] = useState<ExpenseType>(initial?.type || 'Expense');
  const [payment, setPayment] = useState(initial?.payment || initial?.paymentMethod || 'UPI');
  const [note, setNote] = useState(initial?.note || initial?.description || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return setError('Add a transaction title.');
    if (!amount || Number(amount) <= 0) {
      return setError('Enter an amount greater than zero.');
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        title: title.trim(),
        amount: Number(amount),
        category: type === 'Income' ? 'Income' : category,
        date,
        type,
        payment,
        paymentMethod: payment,
        note,
        description: note,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save expense';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="expense-modal" onSubmit={submit}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              {initial ? 'UPDATE RECORD' : 'NEW RECORD'}
            </span>
            <h2>{initial ? 'Edit transaction' : 'Add transaction'}</h2>
            <p>Enter the details below to keep your ledger up to date.</p>
          </div>
          <button
            type="button"
            className="icon-button close-modal"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>

        <div className="type-switch">
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

        <label className="form-field">
          <span>Title</span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grocery shopping"
            required
          />
        </label>

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
            <span>Payment method</span>
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

        <label className="form-field">
          <span>
            Notes <small>Optional</small>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this transaction…"
            rows={3}
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="modal-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={16} />{' '}
                <span>{initial ? 'Save changes' : 'Save transaction'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionModal;
