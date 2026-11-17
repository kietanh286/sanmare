/**
 * Bộ nhận diện và xử lý liên kết đa sàn: Shopee, Lazada, TikTok Shop
 * Tích hợp ACCESSTRADE API chính thức & bóc tách metadata sản phẩm
 */
import { createAccesstradeLink } from '@/lib/accesstrade/client';

export type PlatformType = 'shopee' | 'lazada' | 'tiktok' | 'unknown';

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  logo: string;
  brandColor: string;
  deeplinkScheme: string;
}

export const PLATFORMS: Record<PlatformType, PlatformConfig> = {
  shopee: {
    id: 'shopee',
    name: 'Shopee',
    logo: '🛍️',
    brandColor: 'from-orange-500 to-red-500',
    deeplinkScheme: 'shopeevn://',
  },
  lazada: {
    id: 'lazada',
    name: 'Lazada',
    logo: '💙',
    brandColor: 'from-blue-600 to-indigo-600',
    deeplinkScheme: 'lazada://',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok Shop',
    logo: '🎵',
    brandColor: 'from-slate-900 to-pink-600',
    deeplinkScheme: 'snssdk1180://',
  },
  unknown: {
    id: 'unknown',
    name: 'Thương mại điện tử',
    logo: '🛒',
    brandColor: 'from-slate-600 to-slate-800',
    deeplinkScheme: '',
  },
};

/**
 * Tự động phát hiện sàn từ URL
 */
export function detectPlatform(url: string): PlatformType {
  const lower = url.toLowerCase();
  if (
    lower.includes('shopee.vn') ||
    lower.includes('shope.ee') ||
    lower.includes('s.shopee.vn') ||
    lower.includes('shp.ee')
  ) {
    return 'shopee';
  }
  if (lower.includes('lazada.vn') || lower.includes('s.lazada.vn') || lower.includes('lzd.co')) {
    return 'lazada';
  }
  if (lower.includes('tiktok.com') || lower.includes('vt.tiktok.com')) {
    return 'tiktok';
  }
  return 'unknown';
}

/**
 * Xử lý link đa sàn và tạo link tracking Accesstrade kèm deeplink mở app
 */
export async function resolveMultiPlatformLink(rawInput: string, customAffTag?: string) {
  const urlMatch = rawInput.match(/https?:\/\/[^\s]+/i);
  const targetUrl = urlMatch ? urlMatch[0] : rawInput.trim();
  const platform = detectPlatform(targetUrl);

  const affTag = customAffTag || process.env.DEFAULT_AFFILIATE_ID || 'sanmare_vip';

  let canonicalUrl = targetUrl;
  let itemId = '';
  let shopId = '';
  let productName = 'Sản phẩm ' + PLATFORMS[platform].name;
  let productImage = '';
  let originalPrice = '';
  let discountedPrice = '';
  let description = 'Sản phẩm chính hãng, hỗ trợ đổi trả và áp dụng voucher sàn';

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (response.url) {
      canonicalUrl = response.url;
    }

    // Đọc OpenGraph meta tags từ HTML nếu có
    if (response.ok) {
      const htmlText = await response.text();

      // Bóc tách og:image
      const imgMatch =
        htmlText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        htmlText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (imgMatch && imgMatch[1]) {
        productImage = imgMatch[1];
      }

      // Bóc tách og:title
      const titleMatch =
        htmlText.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        htmlText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      if (titleMatch && titleMatch[1]) {
        const cleanTitle = titleMatch[1].replace(/\|\s*(Shopee|Lazada|TikTok).*/i, '').trim();
        if (cleanTitle) productName = cleanTitle;
      }

      // Bóc tách og:description
      const descMatch =
        htmlText.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
        htmlText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].slice(0, 110).trim();
      }
    }
  } catch {
    // Giữ nguyên canonicalUrl nếu fetch bị chặn
  }

  const parsedUrl = new URL(canonicalUrl);

  // Bóc tách ID sản phẩm & Tên sản phẩm theo từng sàn
  if (platform === 'shopee') {
    const matchStandard = parsedUrl.pathname.match(/-i\.(\d+)\.(\d+)/);
    const matchProduct = parsedUrl.pathname.match(/\/product\/(\d+)\/(\d+)/);

    if (matchStandard) {
      shopId = matchStandard[1];
      itemId = matchStandard[2];
      const slug = parsedUrl.pathname.substring(1, matchStandard.index);
      if (!productName || productName.includes('Sản phẩm')) {
        productName = decodeURIComponent(slug).replace(/-/g, ' ');
      }
    } else if (matchProduct) {
      shopId = matchProduct[1];
      itemId = matchProduct[2];
    }

    if (!description || description.includes('chính hãng')) {
      description = 'Được bảo đảm bởi Shopee • Freeship Xtra • Hoàn xu 100%';
    }
  } else if (platform === 'lazada') {
    const matchLzd = parsedUrl.pathname.match(/-i(\d+)-s(\d+)\.html/);
    if (matchLzd) {
      itemId = matchLzd[1];
      shopId = matchLzd[2];
    }
    if (!description || description.includes('chính hãng')) {
      description = 'LazMall chính hãng 100% • Miễn phí giao hàng • Đổi trả 30 ngày';
    }
  } else if (platform === 'tiktok') {
    const matchTiktokProduct = parsedUrl.pathname.match(/\/view\/product\/(\d+)/);
    if (matchTiktokProduct) {
      itemId = matchTiktokProduct[1];
    } else {
      itemId = parsedUrl.searchParams.get('product_id') || '';
    }

    // Trích xuất từ tham số og_info có sẵn trong link TikTok
    const ogInfo = parsedUrl.searchParams.get('og_info');
    if (ogInfo) {
      try {
        const og = JSON.parse(ogInfo);
        if (og.title) productName = og.title;
        if (og.image) productImage = og.image;
      } catch {
        // ignore
      }
    }

    if (!description || description.includes('chính hãng')) {
      description = 'TikTok Shop Verified • Áp dụng voucher Video & Live • Đổi trả dễ dàng';
    }
  }

  // Thiết lập mức giá mẫu trực quan nếu không đọc được từ meta
  if (!originalPrice) {
    originalPrice = 'Giá niêm yết tại sàn';
    discountedPrice = 'Giảm thêm 15% - 50% khi mở App';
  }

  // 1. Gọi ACCESSTRADE API để tạo link Affiliate chính thức
  const atResult = await createAccesstradeLink(platform, canonicalUrl, affTag);

  let affiliateUrl = atResult?.shortLink || atResult?.affLink || '';
  let isAccesstrade = Boolean(atResult);

  // 2. Chế độ Fallback nếu chưa điền Accesstrade token
  if (!affiliateUrl) {
    if (platform === 'shopee') {
      parsedUrl.searchParams.set('aff_sub', affTag);
      parsedUrl.searchParams.set('utm_source', 'affiliate');
      parsedUrl.searchParams.set('utm_medium', 'sanmare');
      parsedUrl.searchParams.set('utm_campaign', affTag);
      affiliateUrl = parsedUrl.toString();
    } else if (platform === 'lazada') {
      parsedUrl.searchParams.set('aff_sub', affTag);
      parsedUrl.searchParams.set('laz_token', affTag);
      affiliateUrl = parsedUrl.toString();
    } else {
      parsedUrl.searchParams.set('aff_id', affTag);
      affiliateUrl = parsedUrl.toString();
    }
  }

  // 3. Tạo Deeplink kích hoạt ứng dụng trên điện thoại (iOS / Android)
  let deeplinkUrl = affiliateUrl;
  if (platform === 'shopee' && itemId && shopId) {
    deeplinkUrl = `shopeevn://product?shopId=${shopId}&itemId=${itemId}`;
  } else if (platform === 'lazada' && itemId) {
    deeplinkUrl = `lazada://item?itemId=${itemId}`;
  } else if (platform === 'tiktok' && itemId) {
    // Với TikTok Shop: Dùng deeplink PDP có kèm schema hỗ trợ mở thẳng sản phẩm, không rơi vào trang tìm kiếm
    deeplinkUrl = `snssdk1180://ec/pdp?product_id=${itemId}&enter_from=product_detail&traffic_source_list=%5B6%5D`;
  }

  return {
    platform,
    platformInfo: PLATFORMS[platform],
    originalUrl: targetUrl,
    canonicalUrl,
    productName,
    productImage,
    originalPrice,
    discountedPrice,
    description,
    itemId,
    shopId,
    affiliateUrl,
    deeplinkUrl,
    isAccesstrade,
  };
}
