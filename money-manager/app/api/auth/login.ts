import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Login logic will go here
  return NextResponse.json({ message: 'Login successful' });
}
