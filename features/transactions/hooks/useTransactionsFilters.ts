'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Expense } from '@/types/expenses.types';

export function useTransactionsFilters(transactions: Expense[] = [], pageSize: number = 10) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All time');
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Title search
      if (search.trim()) {
        const matches = t.title.toLowerCase().includes(search.trim().toLowerCase());
        if (!matches) return false;
      }

      // Category filter
      if (
        categoryFilter &&
        categoryFilter !== 'All categories' &&
        categoryFilter !== 'All'
      ) {
        if (t.category !== categoryFilter) return false;
      }

      // Type filter
      if (typeFilter && typeFilter !== 'All') {
        if (t.type !== typeFilter) return false;
      }

      // Date filter
      if (dateFilter === 'This month') {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!t.date.startsWith(currentMonth)) return false;
      } else if (dateFilter === 'Last 30 days') {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const itemDate = new Date(t.date);
        if (itemDate < thirtyDaysAgo || itemDate > now) return false;
      }

      return true;
    });
  }, [transactions, search, categoryFilter, typeFilter, dateFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));

  const visibleTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setCategoryFilter('All categories');
    setTypeFilter('All');
    setDateFilter('All time');
    setPage(1);
  }, []);

  return {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter,
    page,
    setPage,
    pageCount,
    totalCount: filteredTransactions.length,
    filteredTransactions,
    visibleTransactions,
    resetFilters,
  };
}

export default useTransactionsFilters;
