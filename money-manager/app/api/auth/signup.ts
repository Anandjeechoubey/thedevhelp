import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Signup logic will go here
  return NextResponse.json({ message: 'Signup successful' });
}
