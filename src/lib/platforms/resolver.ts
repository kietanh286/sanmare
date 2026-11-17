/**
 * Bộ nhận diện và xử lý liên kết đa sàn: Shopee, Lazada, TikTok Shop
 * Tích hợp ACCESSTRADE API chính thức
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

  const affTag = customAffTag || process.env.DEFAULT_AFFILIATE_ID || 'tiemma_vip';

  let canonicalUrl = targetUrl;
  let itemId = '';
  let shopId = '';
  let productName = 'Sản phẩm ' + PLATFORMS[platform].name;

  try {
    const response = await fetch(targetUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (response.url) {
      canonicalUrl = response.url;
    }
  } catch {
    // Giữ nguyên canonicalUrl nếu fetch bị chặn
  }

  const parsedUrl = new URL(canonicalUrl);

  // Bóc tách ID sản phẩm theo từng sàn
  if (platform === 'shopee') {
    const matchStandard = parsedUrl.pathname.match(/-i\.(\d+)\.(\d+)/);
    const matchProduct = parsedUrl.pathname.match(/\/product\/(\d+)\/(\d+)/);

    if (matchStandard) {
      shopId = matchStandard[1];
      itemId = matchStandard[2];
      const slug = parsedUrl.pathname.substring(1, matchStandard.index);
      productName = decodeURIComponent(slug).replace(/-/g, ' ');
    } else if (matchProduct) {
      shopId = matchProduct[1];
      itemId = matchProduct[2];
    }
  } else if (platform === 'lazada') {
    const matchLzd = parsedUrl.pathname.match(/-i(\d+)-s(\d+)\.html/);
    if (matchLzd) {
      itemId = matchLzd[1];
      shopId = matchLzd[2];
    }
    productName = 'Sản phẩm Lazada';
  } else if (platform === 'tiktok') {
    productName = 'Sản phẩm TikTok Shop';
  }

  // 1. Thử tạo link Affiliate qua ACCESSTRADE API
  const atResult = await createAccesstradeLink(platform, canonicalUrl, affTag);

  let affiliateUrl = atResult?.shortLink || atResult?.affLink || '';
  let isAccesstrade = Boolean(atResult);

  // 2. Chế độ Fallback nếu chưa điền Accesstrade token
  if (!affiliateUrl) {
    if (platform === 'shopee') {
      parsedUrl.searchParams.set('aff_sub', affTag);
      parsedUrl.searchParams.set('utm_source', 'affiliate');
      parsedUrl.searchParams.set('utm_medium', 'tiemma');
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

  // 3. Tạo Deeplink App thông minh
  let deeplinkUrl = affiliateUrl;
  if (platform === 'shopee' && itemId && shopId) {
    deeplinkUrl = `shopeevn://product?shopId=${shopId}&itemId=${itemId}`;
  } else if (platform === 'lazada' && itemId) {
    deeplinkUrl = `lazada://item?itemId=${itemId}`;
  }

  return {
    platform,
    platformInfo: PLATFORMS[platform],
    originalUrl: targetUrl,
    canonicalUrl,
    productName,
    itemId,
    shopId,
    affiliateUrl,
    deeplinkUrl,
    isAccesstrade,
  };
}
