import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { categories, CategoryType } from '@/constants/categories.constants';

export interface IExpense extends Document {
  userId: Types.ObjectId;
  title: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  type: 'Expense' | 'Income';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: Number.isFinite,
        message: 'Amount must be a finite number',
      },
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: categories as unknown as string[],
        message: '{VALUE} is not a valid category',
      },
    },
    date: {
      type: String,
      required: [true, 'Please provide a transaction date'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
      trim: true,
    },
    type: {
      type: String,
      enum: ['Expense', 'Income'],
      default: 'Expense',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        if (ret._id) {
          ret.id = (ret._id as { toString(): string }).toString();
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for high performance user query sorting by date
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
