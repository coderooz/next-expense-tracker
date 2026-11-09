import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/db/mongodb';
import Expense, { IExpense } from '@/models/expense.model';
import { CategoryType } from '@/constants/categories.constants';
import {
  expenseQuerySchema,
  expenseSchema,
} from '@/lib/validations/expense.schema';

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const queryParams = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      type: searchParams.get('type') || 'All',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    };

    const parsedQuery = expenseQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { search, category, from, to, type, page, limit } = parsedQuery.data;

    await connectToDatabase();

    const userObjectId = new mongoose.Types.ObjectId(session.user.id);
    const filter: Record<string, unknown> = { userId: userObjectId };

    if (search.trim()) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    if (category && category !== 'All categories' && category !== 'All') {
      filter.category = category;
    }

    if (type && type !== 'All') {
      filter.type = type;
    }

    if (from || to) {
      const dateFilter: Record<string, string> = {};
      if (from) dateFilter.$gte = from;
      if (to) dateFilter.$lte = to;
      filter.date = dateFilter;
    }

    const skip = (page - 1) * limit;

    const [items, total, summaryAggregation] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Expense.countDocuments(filter),
      // Aggregate full summary for this user
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalExpenses: {
              $sum: {
                $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0],
              },
            },
            totalIncome: {
              $sum: {
                $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0],
              },
            },
          },
        },
      ]),
    ]);

    const summaryStats = summaryAggregation[0] || {
      totalExpenses: 0,
      totalIncome: 0,
    };

    const formattedItems = items.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      date: doc.date,
      amount: doc.amount,
      type: doc.type,
      payment: doc.paymentMethod || 'UPI',
      paymentMethod: doc.paymentMethod || 'UPI',
      note: doc.description || '',
      description: doc.description || '',
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
        summary: {
          totalExpenses: summaryStats.totalExpenses,
          totalIncome: summaryStats.totalIncome,
          netBalance: summaryStats.totalIncome - summaryStats.totalExpenses,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching expenses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = expenseSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message);
      return NextResponse.json(
        { success: false, error: issues.join(', ') || 'Invalid expense data' },
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

    const createdExpense = (await Expense.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      title,
      amount,
      category: category as CategoryType,
      date,
      paymentMethod: payment || paymentMethod || 'UPI',
      type: type || 'Expense',
      description: note || description || '',
    })) as unknown as IExpense;

    return NextResponse.json(
      {
        success: true,
        message: 'Expense created successfully',
        data: {
          id: createdExpense._id.toString(),
          title: createdExpense.title,
          category: createdExpense.category,
          date: createdExpense.date,
          amount: createdExpense.amount,
          type: createdExpense.type,
          payment: createdExpense.paymentMethod,
          paymentMethod: createdExpense.paymentMethod,
          note: createdExpense.description,
          description: createdExpense.description,
          createdAt: createdExpense.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while creating expense' },
      { status: 500 }
    );
  }
}
