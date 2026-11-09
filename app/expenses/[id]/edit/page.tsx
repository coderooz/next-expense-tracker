'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/transactions/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import type { Expense, DraftExpense } from '@/types/expenses.types';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { updateExpense } = useExpenses();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function fetchExpense() {
      try {
        setLoading(true);
        const res = await fetch(`/api/expenses/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to load expense details');
        }

        if (isMounted) {
          setExpense(data.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch expense');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchExpense();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdate = async (draft: DraftExpense) => {
    if (!id) return;
    await updateExpense(id, draft);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-64" />
        <div className="bg-white border border-[#e8edef] rounded-2xl p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white border border-[#e8edef] rounded-2xl p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#202b37] mb-2">Transaction Not Found</h2>
          <p className="text-xs text-[#788591] mb-6">
            {error || "The transaction you are looking for could not be found or you do not have permission to edit it."}
          </p>
          <button
            onClick={() => router.push('/expenses')}
            className="button button-primary inline-flex"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return <ExpenseForm mode="edit" initialData={expense} onSubmit={handleUpdate} />;
}
