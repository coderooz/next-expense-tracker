import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/db/mongodb';
import Expense from '@/models/expense.model';
import { expenseSchema } from '@/lib/validations/expense.schema';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const expense = await Expense.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user.id),
    }).lean();

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Expense not found or you do not have permission to view this record',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: expense._id.toString(),
        title: expense.title,
        category: expense.category,
        date: expense.date,
        amount: expense.amount,
        type: expense.type || 'Expense',
        payment: expense.paymentMethod || 'UPI',
        paymentMethod: expense.paymentMethod || 'UPI',
        note: expense.description || '',
        description: expense.description || '',
        createdAt: expense.createdAt ? new Date(expense.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: expense.updatedAt ? new Date(expense.updatedAt).toISOString() : new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching single expense:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching expense' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const result = expenseSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message);
      return NextResponse.json(
        { success: false, error: issues.join(', ') || 'Validation failed' },
        { status: 422 }
      );
    }

    const {
      title,
      amount,
      category,
      date,
      paymentMethod,
      payment,
      type,
      description,
      note,
    } = result.data;

    await connectToDatabase();

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(session.user.id),
      },
      {
        title,
        amount,
        category,
        date,
        paymentMethod: payment || paymentMethod || 'UPI',
        type: type || 'Expense',
        description: note || description || '',
      },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Expense not found or you do not have permission to modify this record',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        id: updatedExpense._id.toString(),
        title: updatedExpense.title,
        category: updatedExpense.category,
        date: updatedExpense.date,
        amount: updatedExpense.amount,
        type: updatedExpense.type,
        payment: updatedExpense.paymentMethod,
        paymentMethod: updatedExpense.paymentMethod,
        note: updatedExpense.description,
        description: updatedExpense.description,
        updatedAt: updatedExpense.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while updating expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedExpense = await Expense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!deletedExpense) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Expense not found or you do not have permission to delete this record',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while deleting expense' },
      { status: 500 }
    );
  }
}
