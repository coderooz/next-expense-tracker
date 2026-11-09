'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNavigation from '@/components/layout/MobileNavigation';
import TransactionModal from '@/components/transactions/TransactionModal';
import ConfirmDelete from '@/components/transactions/ConfirmDelete';
import Toast from '@/components/shared/Toast';
import { useApp } from '@/context/AppContext';
import { useExpenses } from '@/hooks/useExpenses';
import type { DraftExpense } from '@/types/expenses.types';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const {
    isModalOpen,
    setIsModalOpen,
    editingExpense,
    setEditingExpense,
    deletingExpense,
    setDeletingExpense,
    toast,
    showToast,
    hideToast,
  } = useApp();

  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveExpense = async (draft: DraftExpense) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, draft);
      showToast('Transaction updated successfully', 'success');
      setEditingExpense(null);
    } else {
      await addExpense(draft);
      showToast('Transaction created successfully', 'success');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    try {
      setIsDeleting(true);
      await deleteExpense(deletingExpense.id);
      showToast('Transaction deleted successfully', 'success');
      setDeletingExpense(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete transaction';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-shell min-h-screen bg-[#f5f7f8]">
      <Sidebar />
      <MobileNavigation
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="main-area">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="page-content">{children}</main>
      </div>

      {isModalOpen && (
        <TransactionModal
          initial={editingExpense}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
        />
      )}

      {deletingExpense && (
        <ConfirmDelete
          item={deletingExpense}
          onCancel={() => setDeletingExpense(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default DashboardShell;
