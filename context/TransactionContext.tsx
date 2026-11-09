'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Expense, DraftExpense } from '@/types/expenses.types';

interface TransactionContextType {
  transactions: Expense[];
  ready: boolean;
  addTransaction: (draft: DraftExpense) => void;
  updateTransaction: (id: string, draft: DraftExpense) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Expense[]>([]);

  const addTransaction = useCallback((draft: DraftExpense) => {
    setTransactions((current) => [
      {
        ...draft,
        id: crypto.randomUUID(),
        payment: draft.paymentMethod || 'UPI',
      },
      ...current,
    ]);
  }, []);

  const updateTransaction = useCallback((id: string, draft: DraftExpense) => {
    setTransactions((current) =>
      current.map((item) =>
        item.id === id ? { ...draft, id, payment: draft.paymentMethod || item.payment } : item
      )
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        ready: true,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionsContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionsContext must be used within TransactionProvider');
  }
  return context;
}

export default TransactionProvider;
