import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// A faulty API route to test Sentry's error monitoring
export function GET() {
  return NextResponse.json({ data: 'Testing Sentry Error...' });
}
