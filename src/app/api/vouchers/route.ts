import { NextRequest, NextResponse } from 'next/server';
import { getVouchersByPlatform } from '@/lib/vouchers/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'all';

  const vouchers = getVouchersByPlatform(platform);

  return NextResponse.json({
    success: true,
    total: vouchers.length,
    vouchers,
  });
}
