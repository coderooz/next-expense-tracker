import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Laptop,
  Banknote,
  Coffee,
  ReceiptText,
  Plane,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export const categories = [
  'Food & dining',
  'Transport',
  'Travel',
  'Shopping',
  'Bills & utilities',
  'Entertainment',
  'Health',
  'Education',
  'Income',
  'Other',
] as const;

export type CategoryType = (typeof categories)[number];

export const expenseCategories = categories.filter((c) => c !== 'Income') as readonly CategoryType[];

export const categoryColors: Record<CategoryType, string> = {
  'Food & dining': 'mint',
  Transport: 'blue',
  Travel: 'cyan',
  Shopping: 'violet',
  'Bills & utilities': 'amber',
  Entertainment: 'pink',
  Health: 'teal',
  Education: 'indigo',
  Income: 'green',
  Other: 'slate',
};

export const categoryIcons: Record<CategoryType, LucideIcon> = {
  'Food & dining': Utensils,
  Transport: Car,
  Travel: Plane,
  Shopping: ShoppingBag,
  'Bills & utilities': Home,
  Entertainment: Laptop,
  Income: Banknote,
  Health: Coffee,
  Education: GraduationCap,
  Other: ReceiptText,
};
