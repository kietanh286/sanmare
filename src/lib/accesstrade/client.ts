/**
 * Module kết nối ACCESSTRADE API để tạo link affiliate tự động
 * Tài liệu: https://api.accesstrade.vn/v1/product_link/create
 */

export interface AccesstradeLinkResult {
  affLink: string;
  shortLink?: string;
  isSuccess: boolean;
}

/**
 * Gọi API Accesstrade để sinh link affiliate (aff_link & short_link)
 */
export async function createAccesstradeLink(
  platform: 'shopee' | 'lazada' | 'tiktok' | 'unknown',
  originalUrl: string,
  sub1?: string
): Promise<AccesstradeLinkResult | null> {
  const token = process.env.ACCESSTRADE_API_KEY;

  if (!token) {
    return null;
  }

  const campaigns: Record<string, string> = {
    shopee: process.env.SHOPEE_CAMPAIGN_ID || '4751584435713464253',
    lazada: process.env.LAZADA_CAMPAIGN_ID || '4348614231480407268',
    tiktok: process.env.TIKTOK_CAMPAIGN_ID || '6648523843406889655',
  };

  const campaignId = campaigns[platform] || campaigns.shopee;

  try {
    const payload = {
      campaign_id: campaignId,
      urls: [originalUrl],
      utm_source: 'tiemma',
      utm_medium: 'web_converter',
      utm_campaign: 'flash_sale',
      sub1: sub1 || 'user_guest',
    };

    const response = await fetch('https://api.accesstrade.vn/v1/product_link/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`Accesstrade API HTTP error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const successLink = data?.data?.success_link?.[0];

    if (successLink) {
      return {
        affLink: successLink.aff_link,
        shortLink: successLink.short_link,
        isSuccess: true,
      };
    }

    return null;
  } catch (err) {
    console.warn('Lỗi khi gọi Accesstrade API:', err);
    return null;
  }
}
