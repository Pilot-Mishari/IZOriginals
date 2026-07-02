import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, mobile, district, streetAddress } = body;

    // 1. Strict validation for all required fields
    if (!name || !email || !password || !mobile || !district || !streetAddress) {
      return NextResponse.json(
        { error: 'Please fill out all required fields.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Check for existing users
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user with the new location and contact data
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      district,
      streetAddress,
      city: 'Riyadh', // Hardcoded safely on the backend
      role: 'USER',
    });

    return NextResponse.json({ success: true, user: { id: newUser._id, email: newUser.email } }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: 'Something went wrong during registration.' },
      { status: 500 }
    );
  }
}