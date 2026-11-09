'use client';

import React from 'react';
import { ExpenseForm } from '@/components/transactions/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import type { DraftExpense } from '@/types/expenses.types';

export default function NewExpensePage() {
  const { addExpense } = useExpenses();

  const handleCreate = async (draft: DraftExpense) => {
    await addExpense(draft);
  };

  return <ExpenseForm mode="create" onSubmit={handleCreate} />;
}
