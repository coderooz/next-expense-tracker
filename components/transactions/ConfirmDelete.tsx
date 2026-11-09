'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Expense } from '@/types/expenses.types';

interface ConfirmDeleteProps {
  item: Expense;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
}

export function ConfirmDelete({
  item,
  onCancel,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="confirm-modal">
        <div className="delete-symbol">
          <Trash2 size={20} />
        </div>
        <h2>Delete transaction?</h2>
        <p>
          <strong>{item.title}</strong> will be permanently removed from your expense ledger.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Keep transaction
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
