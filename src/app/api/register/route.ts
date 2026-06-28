import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password, mobileNumber, address } = await request.json();

    // 1. Updated validation to include the new fields
    if (!name || !email || !password || !mobileNumber || !address) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Check if the user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create the new user with the new fields
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      role: 'CUSTOMER',
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}