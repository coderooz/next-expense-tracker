import { z } from 'zod';
import { categories } from '../../constants/categories.constants.ts';

export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title cannot exceed 120 characters' })
    .trim(),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be greater than zero' })
    .finite({ message: 'Amount must be a valid finite number' }),
  category: z.enum(categories),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  paymentMethod: z.string().optional().default('UPI'),
  payment: z.string().optional(),
  type: z.enum(['Expense', 'Income']).default('Expense'),
  description: z.string().max(500, { message: 'Description cannot exceed 500 characters' }).optional().default(''),
  note: z.string().optional(),
});

export const expenseQuerySchema = z.object({
  search: z.string().optional().default(''),
  category: z.string().optional().default(''),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z.enum(['Expense', 'Income', 'All']).optional().default('All'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
