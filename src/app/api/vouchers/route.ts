import { NextRequest, NextResponse } from 'next/server';
import { getAvailableVouchers } from '@/lib/vouchers/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;

  const vouchers = getAvailableVouchers(category);

  return NextResponse.json({
    success: true,
    total: vouchers.length,
    vouchers,
  });
}
