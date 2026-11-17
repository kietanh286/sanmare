import crypto from 'crypto';

export interface AffiliateLinkResult {
  affiliateUrl: string;
  deeplinkUrl: string;
  subId: string;
  isApiGenerated: boolean;
}

/**
 * Tạo chữ ký xác thực HMAC-SHA256 cho Shopee Open Platform
 */
export function generateShopeeSignature(
  appId: string,
  secretKey: string,
  timestamp: number,
  payload: string
): string {
  const baseString = `${appId}${timestamp}${payload}${secretKey}`;
  return crypto.createHash('sha256').update(baseString).digest('hex');
}

/**
 * Tạo link Affiliate chính thức qua Shopee GraphQL API
 */
async function callShopeeGenerateShortLink(
  originalUrl: string,
  subId: string,
  appId: string,
  secretKey: string
): Promise<string | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const query = `
      mutation {
        generateShortLink(input: {
          originUrl: "${originalUrl}",
          subIds: ["${subId}"]
        }) {
          shortLink
        }
      }
    `;

    const payload = JSON.stringify({ query });
    const signature = generateShopeeSignature(appId, secretKey, timestamp, payload);

    const response = await fetch('https://open-api.affiliate.shopee.vn/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`,
      },
      body: payload,
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.data?.generateShortLink?.shortLink || null;
  } catch (error) {
    console.warn('Lỗi khi gọi Shopee Affiliate API:', error);
    return null;
  }
}

/**
 * Xây dựng link Affiliate và Deeplink mở app
 */
export async function createAffiliateLinks(
  canonicalUrl: string,
  shopId?: string,
  itemId?: string,
  customSubId?: string
): Promise<AffiliateLinkResult> {
  const appId = process.env.SHOPEE_APP_ID;
  const secretKey = process.env.SHOPEE_SECRET_KEY;
  const subId = customSubId || process.env.DEFAULT_AFFILIATE_ID || 'tiemma_vip';

  // 1. Thử gọi API chính thức nếu đã cấu hình key
  if (appId && secretKey) {
    const apiLink = await callShopeeGenerateShortLink(canonicalUrl, subId, appId, secretKey);
    if (apiLink) {
      // Deeplink mở app qua link affiliate rút gọn hoặc qua scheme
      const deeplinkUrl = itemId && shopId 
        ? `shopeevn://product?shopId=${shopId}&itemId=${itemId}`
        : apiLink;

      return {
        affiliateUrl: apiLink,
        deeplinkUrl,
        subId,
        isApiGenerated: true,
      };
    }
  }

  // 2. Fallback Mode: Tạo URL có gắn tracking param & Deeplink chuẩn cho App
  const urlObj = new URL(canonicalUrl);
  urlObj.searchParams.set('aff_sub', subId);
  urlObj.searchParams.set('utm_source', 'affiliate');
  urlObj.searchParams.set('utm_medium', 'tiemma_bot');
  urlObj.searchParams.set('utm_campaign', subId);

  const fallbackAffiliateUrl = urlObj.toString();

  // Deeplink trực tiếp vào trang sản phẩm trên ứng dụng Shopee (Android / iOS)
  let deeplinkUrl = fallbackAffiliateUrl;
  if (itemId && shopId) {
    deeplinkUrl = `shopeevn://product?shopId=${shopId}&itemId=${itemId}`;
  }

  return {
    affiliateUrl: fallbackAffiliateUrl,
    deeplinkUrl,
    subId,
    isApiGenerated: false,
  };
}
