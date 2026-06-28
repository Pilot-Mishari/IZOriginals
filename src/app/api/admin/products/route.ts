import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, description, category, basePrice, images } = await request.json();

    if (!title || !description || !category || basePrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Success', data: { title, description, category, basePrice, images } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}