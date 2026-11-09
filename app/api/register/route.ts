import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db/mongodb';
import User from '@/models/user.model';
import { registerSchema } from '@/lib/validations/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message);
      return NextResponse.json(
        {
          success: false,
          error: issues.join(', ') || 'Invalid registration data',
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists.',
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please log in.',
        data: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred during registration. Please try again.',
      },
      { status: 500 }
    );
  }
}
