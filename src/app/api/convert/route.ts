import { NextRequest, NextResponse } from 'next/server';
import { resolveShopeeProduct } from '@/lib/shopee/resolver';
import { createAffiliateLinks } from '@/lib/shopee/affiliate';
import { getAvailableVouchers } from '@/lib/vouchers/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, subId } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp link sản phẩm Shopee hợp lệ' },
        { status: 400 }
      );
    }

    // 1. Phân tích và resolve link Shopee
    const resolved = await resolveShopeeProduct(url);

    if (!resolved.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Đường dẫn không hợp lệ hoặc không thuộc hệ thống Shopee (shopee.vn, s.shopee.vn, shope.ee)',
        },
        { status: 400 }
      );
    }

    // 2. Tạo link Affiliate và Deeplink mở App
    const affiliateResult = await createAffiliateLinks(
      resolved.canonicalUrl,
      resolved.shopId,
      resolved.itemId,
      subId
    );

    // 3. Lấy danh sách voucher gợi ý
    const vouchers = getAvailableVouchers();

    return NextResponse.json({
      success: true,
      product: {
        productName: resolved.productName,
        itemId: resolved.itemId,
        shopId: resolved.shopId,
        canonicalUrl: resolved.canonicalUrl,
        originalUrl: resolved.rawUrl,
      },
      affiliate: {
        affiliateUrl: affiliateResult.affiliateUrl,
        deeplinkUrl: affiliateResult.deeplinkUrl,
        isApiGenerated: affiliateResult.isApiGenerated,
        subId: affiliateResult.subId,
      },
      vouchers,
    });
  } catch (error: any) {
    console.error('Lỗi khi convert link Shopee:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Đã xảy ra lỗi trong quá trình xử lý link' },
      { status: 500 }
    );
  }
}
