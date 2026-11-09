'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type {
  Expense,
  ExpenseApiResponse,
  DraftExpense,
} from '@/types/expenses.types';

export interface UseExpensesOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  from?: string;
  to?: string;
  type?: 'Expense' | 'Income' | 'All';
}

const fetcher = async (url: string): Promise<ExpenseApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch expenses: ${res.status}`);
  }
  return res.json();
};

export function useExpenses(options: UseExpensesOptions = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = 'All categories',
    from = '',
    to = '',
    type = 'All',
  } = options;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));

  if (search.trim()) queryParams.set('search', search.trim());
  if (category && category !== 'All categories' && category !== 'All') {
    queryParams.set('category', category);
  }
  if (from) queryParams.set('from', from);
  if (to) queryParams.set('to', to);
  if (type && type !== 'All') queryParams.set('type', type);

  const key = `/api/expenses?${queryParams.toString()}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<ExpenseApiResponse>(
    key,
    fetcher,
    {
      revalidateOnFocus: true,
      keepPreviousData: true,
      dedupingInterval: 3000,
    }
  );

  const addExpense = useCallback(
    async (newExpense: DraftExpense): Promise<Expense> => {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create expense');
      }

      await mutate();
      return json.data;
    },
    [mutate]
  );

  const updateExpense = useCallback(
    async (id: string, updatedFields: Partial<DraftExpense>): Promise<Expense> => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update expense');
      }

      await mutate();
      return json.data;
    },
    [mutate]
  );

  const deleteExpense = useCallback(
    async (id: string): Promise<void> => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete expense');
      }

      await mutate();
    },
    [mutate]
  );

  return {
    expenses: data?.data?.items || [],
    pagination: data?.data?.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    },
    summary: data?.data?.summary || {
      totalExpenses: 0,
      totalIncome: 0,
      netBalance: 0,
    },
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
