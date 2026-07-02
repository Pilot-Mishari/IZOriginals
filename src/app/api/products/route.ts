import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, imageUrl, status } = body;

    // 1. Make sure the admin didn't leave critical fields blank
    if (!title || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Title, description, and price are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Create and save the new product to MongoDB
    const newProduct = await Product.create({
      title,
      description,
      price: Number(price), // Ensure it saves as a number, not a string
      imageUrl: imageUrl || '',
      status: status || 'ACTIVE',
    });

    // 3. Return the exact saved product back to the frontend
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: 'Failed to save product to the database.' },
      { status: 500 }
    );
  }
}