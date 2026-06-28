import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(request: Request) {
  try {
    
    // 1. Supreme Security Check: Are they logged in AND an Admin?
    const session = await auth();
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    

// ... validation ...

    

    // 2. Validate input fields
    if (!title || !description || !category || basePrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { title, description, category, basePrice, images } = await request.json();
    const newProduct = await Product.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim().toUpperCase(),
        basePrice: Number(basePrice),
        images: images || [], // Saves the Cloudinary URLs!
    });

    await connectToDatabase();

    // 3. Save the new product to the database
    return NextResponse.json({ 
      success: true, 
      message: 'Product published successfully!',
      product: newProduct 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}