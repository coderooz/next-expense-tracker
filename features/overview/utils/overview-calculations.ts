import type { Expense } from '../../../types/expenses.types.ts';
import { categories, type CategoryType } from '../../../constants/categories.constants.ts';

export interface CategoryBreakdownItem {
  category: CategoryType;
  value: number;
  percentage: number;
}

export function calculateFinancialSummary(transactions: Expense[]) {
  const income = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return {
    income,
    expenses,
    balance,
    savingsRate,
  };
}

export function calculateCategoryBreakdown(transactions: Expense[]): CategoryBreakdownItem[] {
  const expenseTransactions = transactions.filter((t) => t.type === 'Expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return categories
    .filter((c) => c !== 'Income')
    .map((category) => {
      const value = expenseTransactions
        .filter((t) => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0;
      return {
        category,
        value,
        percentage,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}
