'use client';

import React, { useState } from 'react';
import { Plus, Download, ArrowRight, ArrowLeft } from 'lucide-react';
import PageHeading from '@/components/shared/PageHeading';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTable from '@/components/transactions/TransactionTable';
import { useExpenses } from '@/hooks/useExpenses';
import { useApp } from '@/context/AppContext';
import type { Expense } from '@/types/expenses.types';

export function TransactionsView() {
  const { setIsModalOpen, setEditingExpense, setDeletingExpense } = useApp();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [dateFilter, setDateFilter] = useState('All time');
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Derive date bounds
  const getDateBounds = () => {
    const today = new Date();
    if (dateFilter === 'This month') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
      return {
        from: `${year}-${month}-01`,
        to: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
      };
    }
    if (dateFilter === 'Last 30 days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return {
        from: thirtyDaysAgo.toISOString().slice(0, 10),
        to: today.toISOString().slice(0, 10),
      };
    }
    return { from: undefined, to: undefined };
  };

  const { from, to } = getDateBounds();

  const { expenses, pagination, isLoading } = useExpenses({
    page,
    limit,
    search,
    category,
    from,
    to,
    type: type as 'Expense' | 'Income' | 'All',
  });

  const handleReset = () => {
    setSearch('');
    setCategory('All categories');
    setDateFilter('All time');
    setType('All');
    setPage(1);
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['Title,Category,Date,Type,Amount,Payment,Notes'];
    const rows = expenses.map((e) =>
      [
        `"${e.title.replace(/"/g, '""')}"`,
        `"${e.category}"`,
        e.date,
        e.type,
        e.amount,
        `"${e.paymentMethod || e.payment || 'UPI'}"`,
        `"${(e.note || e.description || '').replace(/"/g, '""')}"`,
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pennywise-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEdit = (item: Expense) => {
    setEditingExpense(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: Expense) => {
    setDeletingExpense(item);
  };

  const total = pagination.total;
  const totalPages = pagination.totalPages;
  const fromRecord = total === 0 ? 0 : (page - 1) * limit + 1;
  const toRecord = Math.min(page * limit, total);

  return (
    <>
      <PageHeading
        eyebrow="TRANSACTIONS"
        title="Transactions Ledger"
        description="Search, filter, update and manage all your income and expenses."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setEditingExpense(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        }
      />

      <section className="panel transactions-panel">
        <TransactionFilters
          search={search}
          category={category}
          dateFilter={dateFilter}
          type={type}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onCategoryChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
          onDateFilterChange={(val) => {
            setDateFilter(val);
            setPage(1);
          }}
          onTypeChange={(val) => {
            setType(val);
            setPage(1);
          }}
          onReset={handleReset}
        />

        <div className="table-meta">
          <span>
            {isLoading ? 'Loading transactions…' : `${total} transactions found`}
          </span>

          <button
            type="button"
            className="export-button"
            onClick={handleExportCSV}
            disabled={expenses.length === 0}
            title="Download CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        <TransactionTable
          rows={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="pagination">
          <span>
            Showing {fromRecord}–{toRecord} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Previous</span>
            </button>
            <span className="page-number">
              {page} / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default TransactionsView;
