/**
 * Quản lý các mốc giờ săn sale trong ngày và lịch các đợt Siêu Sale Lễ / Ngày Đôi của các sàn
 */

export interface FlashTimeSlot {
  time: string; // "00:00", "09:00", ...
  hour: number;
  minute: number;
  title: string;
  highlight: string;
  badge: string;
}

export const FLASH_SLOTS: FlashTimeSlot[] = [
  {
    time: '00:00',
    hour: 0,
    minute: 0,
    title: 'Khai Tiệc Nửa Đêm',
    highlight: 'Mã toàn sàn giảm 50% & Freeship 0Đ',
    badge: 'MÃ TOÀN SÀN',
  },
  {
    time: '09:00',
    hour: 9,
    minute: 0,
    title: 'Săn Hàng Hiệu',
    highlight: 'Giảm 50% hàng chính hãng Mall',
    badge: 'CHÍNH HÃNG',
  },
  {
    time: '12:00',
    hour: 12,
    minute: 0,
    title: 'Nửa Ngày Chớp Nhoáng',
    highlight: 'Flash sale nửa giá - Voucher 50K',
    badge: 'NỬA GIÁ',
  },
  {
    time: '15:00',
    hour: 15,
    minute: 0,
    title: 'Giờ Vàng Freeship',
    highlight: 'Xả mã miễn phí vận chuyển 0Đ',
    badge: 'FREESHIP',
  },
  {
    time: '18:00',
    hour: 18,
    minute: 0,
    title: 'Top Deal Xu Hướng',
    highlight: 'Deal thịnh hành giảm đến 40%',
    badge: 'HOT DEAL',
  },
  {
    time: '20:00',
    hour: 20,
    minute: 0,
    title: 'Shopee Live & Video',
    highlight: 'Mã Video giảm 50% tối đa 100K',
    badge: 'VIDEO / LIVE',
  },
  {
    time: '21:00',
    hour: 21,
    minute: 0,
    title: 'Xả Kho Đồng Giá',
    highlight: 'Đồng giá từ 1K - 9K - 99K',
    badge: 'ĐỒNG GIÁ',
  },
];

export interface SaleEvent {
  name: string;
  theme: string;
  description: string;
  platforms: string[];
  bannerGradient: string;
  isMega: boolean;
}

/**
 * Tự động xác định đợt sale hiện tại hoặc sự kiện sale lớn sắp tới
 */
export function getCurrentSaleEvent(): SaleEvent {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;

  // 1. Kiểm tra ngày đôi (VD: 1.1, 2.2, ... 11.11, 12.12)
  if (day === month) {
    return {
      name: `SIÊU SALE NGÀY ĐÔI ${day}.${month}`,
      theme: 'Mega Campaign Toàn Sàn',
      description: 'Đại tiệc giảm giá lớn nhất tháng: Voucher 50% + Freeship đơn từ 0Đ!',
      platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
      bannerGradient: 'from-rose-600 via-orange-600 to-amber-500',
      isMega: true,
    };
  }

  // 2. Kiểm tra Sale Giữa Tháng (Ngày 15)
  if (day >= 14 && day <= 16) {
    return {
      name: 'SIÊU SALE GIỮA THÁNG (15H)',
      theme: 'Mid-Month Festival',
      description: 'Giảm giá nửa tháng cực bốc: Tung hàng triệu voucher Shopee Video & Live!',
      platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
      bannerGradient: 'from-indigo-600 via-purple-600 to-pink-500',
      isMega: false,
    };
  }

  // 3. Kiểm tra Sale Lương Về (Ngày 25 - 28)
  if (day >= 24 && day <= 28) {
    return {
      name: 'SIÊU SALE LƯƠNG VỀ (PAYDAY)',
      theme: 'Lương Về Săn Sale Hết Ý',
      description: 'Hoàn xu đến 50%, voucher thương hiệu độc quyền và mã giảm toàn sàn.',
      platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
      bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      isMega: false,
    };
  }

  // 4. Các sự kiện theo mùa đặc biệt
  if (month === 11 && day >= 20) {
    return {
      name: 'BLACK FRIDAY & CYBER MONDAY',
      theme: 'Đại Tiệc Giảm Giá Toàn Cầu',
      description: 'Sale sập sàn cuối năm, xả kho hàng triệu deal giảm sốc tới 70%.',
      platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
      bannerGradient: 'from-neutral-900 via-red-900 to-amber-600',
      isMega: true,
    };
  }

  if (month === 12 && day >= 20) {
    return {
      name: 'SIÊU SALE GIÁNG SINH & NĂM MỚI',
      theme: 'Lễ Hội Mua Sắm Cuối Năm',
      description: 'Tặng quà ngập tràn, freeship toàn bộ đơn hàng dịp lễ Tết!',
      platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
      bannerGradient: 'from-red-600 via-emerald-700 to-amber-500',
      isMega: true,
    };
  }

  // Mặc định: Chiến dịch Giờ Vàng Ngày Thường
  return {
    name: 'NGÀY VÀNG SĂN SALE MỖI NGÀY',
    theme: 'Khung Giờ Vàng 0H - 9H - 12H - 20H',
    description: 'Tự động bóc tách link & gắn mã Shopee Video giảm đến 50% cho mọi đơn hàng.',
    platforms: ['Shopee', 'Lazada', 'TikTok Shop'],
    bannerGradient: 'from-orange-600 via-red-600 to-rose-600',
    isMega: false,
  };
}
