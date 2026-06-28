import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Project from '@/models/Project';

export async function GET() {
  try {
    // 1. Boot up the database connection
    await connectToDatabase();

    // 2. Create a test user with a random email so it doesn't crash if you refresh
    const testUser = await User.create({
      name: 'Test Customer',
      email: `test-${Date.now()}@example.com`,
      passwordHash: 'fake_hashed_password',
      role: 'CUSTOMER',
    });

    // 3. Create a standard product from your catalog
    const testProduct = await Product.create({
      title: 'Custom Resin Keychain',
      description: 'Beautiful handmade resin keychain.',
      category: 'Keychains',
      basePrice: 15.00,
      images: [],
    });

    // 4. Create an active custom project order
    const testProject = await Project.create({
      customer: testUser._id,
      baseProduct: testProduct._id,
      title: 'Blue Ocean Keychain Request',
      description: 'I would like a blue ocean style keychain with gold flakes.',
      status: 'PENDING_REVIEW',
      messages: [
        {
          sender: 'CUSTOMER',
          text: 'Hi, I am excited to see the design proof!'
        }
      ]
    });

    // 5. Send success response
    return NextResponse.json({
      success: true,
      message: 'Database connection and models are working perfectly!',
      data: {
        user: testUser,
        product: testProduct,
        project: testProject
      }
    });

  } catch (error: any) {
    // If anything fails, it will print the exact error
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}