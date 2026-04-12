import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("NEW REFERRAL:", body);
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
