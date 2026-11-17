/**
 * Module phân tích và giải mã đường dẫn sản phẩm Shopee
 */

export interface ParsedShopeeProduct {
  isValid: boolean;
  rawUrl: string;
  canonicalUrl: string;
  itemId?: string;
  shopId?: string;
  productName?: string;
}

/**
 * Kiểm tra xem URL có thuộc hệ thống Shopee hay không
 */
export function isShopeeUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();
    return (
      hostname === 'shopee.vn' ||
      hostname.endsWith('.shopee.vn') ||
      hostname === 'shope.ee' ||
      hostname.endsWith('.shope.ee') ||
      hostname === 'shp.ee' ||
      hostname.endsWith('.shp.ee')
    );
  } catch {
    return false;
  }
}

/**
 * Theo dõi HTTP Redirect (301, 302, 307, 308) để lấy canonical URL thật từ link rút gọn
 */
export async function followRedirects(url: string, maxHops: number = 5): Promise<string> {
  let currentUrl = url.trim();
  if (!/^https?:\/\//i.test(currentUrl)) {
    currentUrl = 'https://' + currentUrl;
  }

  let hops = 0;
  while (hops < maxHops) {
    hops++;
    try {
      const response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (location) {
          if (location.startsWith('http')) {
            currentUrl = location;
          } else {
            const base = new URL(currentUrl);
            currentUrl = new URL(location, base.origin).toString();
          }
          continue;
        }
      }

      // Nếu không redirect hoặc là 200, dừng lại
      break;
    } catch {
      // Nếu HEAD thất bại (một số server chặn HEAD), thử bằng GET
      try {
        const getRes = await fetch(currentUrl, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        if (getRes.url && getRes.url !== currentUrl) {
          currentUrl = getRes.url;
        }
      } catch {
        // Giữ URL hiện tại nếu lỗi mạng
      }
      break;
    }
  }

  return currentUrl;
}

/**
 * Trích xuất itemId, shopId và tên sản phẩm từ URL Shopee
 */
export function extractShopeeProductInfo(url: string): {
  itemId?: string;
  shopId?: string;
  productName?: string;
} {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;

    // Trường hợp 1: Dạng tiêu chuẩn "-i.shopId.itemId" (VD: /Ao-thun-nam-i.123456.7891011)
    const standardMatch = pathname.match(/-i\.(\d+)\.(\d+)/);
    if (standardMatch) {
      const slug = pathname.substring(1, standardMatch.index);
      return {
        shopId: standardMatch[1],
        itemId: standardMatch[2],
        productName: decodeURIComponent(slug).replace(/-/g, ' '),
      };
    }

    // Trường hợp 2: Dạng /product/shopId/itemId (VD: /product/123456/7891011)
    const productMatch = pathname.match(/\/product\/(\d+)\/(\d+)/);
    if (productMatch) {
      return {
        shopId: productMatch[1],
        itemId: productMatch[2],
      };
    }

    // Trường hợp 3: Tham số query "?itemid=...&shopid=..."
    const queryItemId = parsed.searchParams.get('itemid') || parsed.searchParams.get('itemId');
    const queryShopId = parsed.searchParams.get('shopid') || parsed.searchParams.get('shopId');
    if (queryItemId && queryShopId) {
      return {
        itemId: queryItemId,
        shopId: queryShopId,
      };
    }

    return {};
  } catch {
    return {};
  }
}

/**
 * Hàm tích hợp: Tiếp nhận link bất kỳ -> Xác thực -> Giải mã -> Bóc tách thông tin
 */
export async function resolveShopeeProduct(rawInput: string): Promise<ParsedShopeeProduct> {
  // Tìm URL trong chuỗi text (người dùng có thể copy cả đoạn tin nhắn kèm link)
  const urlMatch = rawInput.match(/https?:\/\/[^\s]+/i);
  const targetUrl = urlMatch ? urlMatch[0] : rawInput.trim();

  if (!isShopeeUrl(targetUrl)) {
    return {
      isValid: false,
      rawUrl: rawInput,
      canonicalUrl: targetUrl,
    };
  }

  // Lấy canonical URL đầy đủ
  const canonicalUrl = await followRedirects(targetUrl);
  const info = extractShopeeProductInfo(canonicalUrl);

  return {
    isValid: true,
    rawUrl: targetUrl,
    canonicalUrl,
    itemId: info.itemId,
    shopId: info.shopId,
    productName: info.productName || 'Sản phẩm Shopee',
  };
}
