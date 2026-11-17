import { NextRequest, NextResponse } from 'next/server';
import { resolveMultiPlatformLink } from '@/lib/platforms/resolver';
import { getAvailableVouchers } from '@/lib/vouchers/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, subId } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp link sản phẩm hợp lệ' },
        { status: 400 }
      );
    }

    // 1. Phân tích và resolve link đa sàn (Shopee, Lazada, TikTok Shop)
    const result = await resolveMultiPlatformLink(url, subId);

    // 2. Lấy voucher liên quan
    const vouchers = getAvailableVouchers();

    return NextResponse.json({
      success: true,
      data: {
        platform: result.platform,
        platformInfo: result.platformInfo,
        productName: result.productName,
        productImage: result.productImage,
        originalPrice: result.originalPrice,
        discountedPrice: result.discountedPrice,
        description: result.description,
        itemId: result.itemId,
        shopId: result.shopId,
        canonicalUrl: result.canonicalUrl,
        originalUrl: result.originalUrl,
        affiliateUrl: result.affiliateUrl,
        deeplinkUrl: result.deeplinkUrl,
        isAccesstrade: result.isAccesstrade,
        vouchers,
      },
    });
  } catch (error: any) {
    console.error('Lỗi khi convert link đa sàn:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Đã xảy ra lỗi trong quá trình xử lý link' },
      { status: 500 }
    );
  }
}
