import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test data removed for deployment. Fetching production database records.
    const customRequests: any[] = []; 

    return NextResponse.json(customRequests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}