import { CategoryType } from '@/constants/categories.constants';

export type ExpenseType = 'Expense' | 'Income';

export interface Expense {
  id: string;
  _id?: string;
  userId?: string;
  title: string;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  amount: number;
  type: ExpenseType;
  payment: string;
  paymentMethod?: string;
  note?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DraftExpense = Omit<Expense, 'id' | '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type Draft = DraftExpense;

export interface ExpensePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
}

export interface ExpenseApiResponse {
  success: boolean;
  data: {
    items: Expense[];
    pagination: ExpensePagination;
    summary: ExpenseSummary;
  };
  error?: string;
}
