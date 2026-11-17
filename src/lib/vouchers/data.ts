export type PlatformVoucher = 'shopee' | 'lazada' | 'tiktok' | 'all';

export interface VoucherItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  minSpend: string;
  platform: PlatformVoucher;
  category: 'video' | 'freeship' | 'live' | 'all' | 'extra';
  categoryLabel: string;
  badge?: string;
  note?: string;
  instruction?: string;
}

export const ALL_VOUCHERS: VoucherItem[] = [
  // --- TIKTOK SHOP VOUCHERS ---
  {
    id: 'tt-video-50',
    code: 'TIKTOK50K',
    title: 'Mã Giảm 50% Video TikTok',
    discount: 'Giảm 50% tối đa 50K',
    minSpend: 'Đơn từ 0đ',
    platform: 'tiktok',
    category: 'video',
    categoryLabel: 'TikTok Video',
    badge: 'GIẢM SÂU',
    note: 'Chỉ áp dụng khi mua qua Giỏ hàng Video',
    instruction: '1. Bấm mở App TikTok\n2. Nhấn vào biểu tượng Giỏ hàng trên Video để tự động lưu mã 50%',
  },
  {
    id: 'tt-video-70k',
    code: 'TTMALL70K',
    title: 'Mã TikTok Shop Mall Video',
    discount: 'Giảm 20% tối đa 70K',
    minSpend: 'Đơn từ 100K',
    platform: 'tiktok',
    category: 'video',
    categoryLabel: 'TikTok Mall',
    badge: 'HOT',
    note: 'Áp dụng cho sản phẩm Mall chính hãng',
  },
  {
    id: 'tt-fs-extra',
    code: 'FREESHIPEXTRA',
    title: 'Freeship TikTok Shop',
    discount: 'Giảm tối đa 30K - 70K phí vận chuyển',
    minSpend: 'Đơn từ 45K',
    platform: 'tiktok',
    category: 'freeship',
    categoryLabel: 'Freeship Xtra',
    badge: 'FREESHIP',
    note: 'Tự động áp dụng khi thanh toán',
  },
  {
    id: 'tt-live-25',
    code: 'LIVEHOT25',
    title: 'Mã Livestream TikTok Shop',
    discount: 'Giảm 15% tối đa 40K',
    minSpend: 'Đơn từ 50K',
    platform: 'tiktok',
    category: 'live',
    categoryLabel: 'TikTok Live',
    badge: 'LIVESTREAM',
    note: 'Áp dụng khi xem phiên Live của nhà bán',
  },

  // --- SHOPEE VOUCHERS ---
  {
    id: 'sh-video-50',
    code: 'VIDEO50K',
    title: 'Mã Shopee Video 50%',
    discount: 'Giảm 50% tối đa 40K',
    minSpend: 'Đơn từ 0đ',
    platform: 'shopee',
    category: 'video',
    categoryLabel: 'Shopee Video',
    badge: 'HOT NHẤT',
    note: 'Áp dụng khi thêm sản phẩm vào giỏ từ Video',
    instruction: '1. Mở App Shopee\n2. Bấm "Thêm vào giỏ từ Video" để kích hoạt mã giảm 50%',
  },
  {
    id: 'sh-video-25',
    code: 'VIDEOSHOP25',
    title: 'Mã Shopee Video Chọn Lọc',
    discount: 'Giảm 25% tối đa 100K',
    minSpend: 'Đơn từ 150K',
    platform: 'shopee',
    category: 'video',
    categoryLabel: 'Shopee Video',
    badge: 'TIẾT KIỆM',
    note: 'Mở app qua link để tự động lưu mã',
  },
  {
    id: 'sh-fs-0d',
    code: 'FREESHIP0D',
    title: 'Mã Freeship 0Đ Shopee',
    discount: 'Giảm tối đa 25K phí ship',
    minSpend: 'Đơn từ 0đ',
    platform: 'shopee',
    category: 'freeship',
    categoryLabel: 'Freeship Xtra',
    badge: 'TOÀN SÀN',
    note: 'Áp dụng toàn sàn Shopee',
  },
  {
    id: 'sh-gold-hour',
    code: 'SAN12K',
    title: 'Mã Khung Giờ Vàng Shopee',
    discount: 'Giảm 12% tối đa 50K',
    minSpend: 'Đơn từ 99K',
    platform: 'shopee',
    category: 'all',
    categoryLabel: 'Giờ Vàng',
    badge: 'GIỜ VÀNG',
    note: 'Làm mới lúc 0h - 9h - 12h - 20h',
  },

  // --- LAZADA VOUCHERS ---
  {
    id: 'lzd-max-50',
    code: 'MAX50K',
    title: 'Voucher Tích Lũy Lazada',
    discount: 'Giảm 50K mỗi 300K',
    minSpend: 'Đơn từ 300K',
    platform: 'lazada',
    category: 'all',
    categoryLabel: 'Lazada Max',
    badge: 'TÍCH LŨY',
    note: 'Thu thập trên App Lazada',
  },
  {
    id: 'lzd-fs-max',
    code: 'FSMAX',
    title: 'Freeship Max Lazada',
    discount: 'Giảm tối đa 50K ship',
    minSpend: 'Đơn từ 49K',
    platform: 'lazada',
    category: 'freeship',
    categoryLabel: 'Freeship Max',
    badge: 'FREESHIP',
    note: 'Tự động áp dụng tại giỏ hàng',
  },
];

/**
 * Lấy danh sách voucher theo nền tảng (sàn)
 */
export function getVouchersByPlatform(platform: string): VoucherItem[] {
  const normalized = platform.toLowerCase();
  const matched = ALL_VOUCHERS.filter(
    (v) => v.platform === normalized || v.platform === 'all'
  );
  return matched.length > 0 ? matched : ALL_VOUCHERS.filter((v) => v.platform === 'tiktok');
}

export const CURRENT_VOUCHERS = ALL_VOUCHERS;
