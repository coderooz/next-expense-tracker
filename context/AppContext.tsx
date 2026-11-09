'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Expense, ExpenseSummary } from '@/types/expenses.types';

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  summary: ExpenseSummary;
  setSummary: (summary: ExpenseSummary) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  deletingExpense: Expense | null;
  setDeletingExpense: (expense: Expense | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const defaultSummary: ExpenseSummary = {
  totalExpenses: 0,
  totalIncome: 0,
  netBalance: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [summary, setSummary] = useState<ExpenseSummary>(defaultSummary);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeView, setActiveView] = useState('Overview');

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((current) => (current?.message === message ? null : current));
      }, 3500);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        summary,
        setSummary,
        isModalOpen,
        setIsModalOpen,
        editingExpense,
        setEditingExpense,
        deletingExpense,
        setDeletingExpense,
        toast,
        showToast,
        hideToast,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
