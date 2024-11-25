import { NextResponse } from 'next/server';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-default-token';

export async function POST(request: Request) {
  const { token } = await request.json();
  
  if (token === ADMIN_TOKEN) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
} 