export interface VoucherItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  minSpend: string;
  category: 'video' | 'freeship' | 'all' | 'category' | 'shopeepay';
  categoryLabel: string;
  timeSlot?: string;
  badge?: string;
  expiresIn?: string;
  note?: string;
}

export const CURRENT_VOUCHERS: VoucherItem[] = [
  {
    id: 'v-video-50',
    code: 'VIDEO50K',
    title: 'Mã Shopee Video Hot',
    discount: 'Giảm 50% tối đa 40K',
    minSpend: 'Đơn từ 0đ',
    category: 'video',
    categoryLabel: 'Shopee Video',
    badge: 'HOT NHẤT',
    note: 'Áp dụng khi thêm sản phẩm từ Video',
  },
  {
    id: 'v-video-25',
    code: 'VIDEOSHOP25',
    title: 'Mã Video Đơn Chọn Lọc',
    discount: 'Giảm 25% tối đa 100K',
    minSpend: 'Đơn từ 150K',
    category: 'video',
    categoryLabel: 'Shopee Video',
    badge: 'TIẾT KIỆM',
    note: 'Mở app qua link để tự động lưu mã',
  },
  {
    id: 'v-fs-0d',
    code: 'FREESHIP0D',
    title: 'Mã Miễn Phí Vận Chuyển',
    discount: 'Giảm tối đa 25K phí ship',
    minSpend: 'Đơn từ 0đ',
    category: 'freeship',
    categoryLabel: 'Freeship Xtra',
    badge: 'TOÀN SÀN',
    note: 'Áp dụng cho đơn hàng Shopee Mall và Shop Yêu Thích',
  },
  {
    id: 'v-fs-70k',
    code: 'FREESHIP70K',
    title: 'Freeship Xtra Plus',
    discount: 'Giảm tối đa 70K phí ship',
    minSpend: 'Đơn từ 200K',
    category: 'freeship',
    categoryLabel: 'Freeship Xtra',
    note: 'Tự động áp dụng khi thanh toán',
  },
  {
    id: 'v-all-12',
    code: 'SAN12K',
    title: 'Mã Khung Giờ Vàng',
    discount: 'Giảm 12% tối đa 50K',
    minSpend: 'Đơn từ 99K',
    category: 'all',
    categoryLabel: 'Toàn sàn',
    timeSlot: '00:00 - 09:00 - 12:00 - 20:00',
    badge: 'GIỜ VÀNG',
    note: 'Mở mới vào các khung giờ chính trong ngày',
  },
  {
    id: 'v-pay-30k',
    code: 'SPAY30K',
    title: 'Ưu Đãi Ví ShopeePay',
    discount: 'Giảm ngay 30K',
    minSpend: 'Đơn từ 100K',
    category: 'shopeepay',
    categoryLabel: 'ShopeePay',
    note: 'Áp dụng khi chọn phương thức thanh toán ShopeePay',
  },
];

/**
 * Lấy danh sách voucher theo bộ lọc
 */
export function getAvailableVouchers(category?: string): VoucherItem[] {
  if (!category || category === 'all_categories') {
    return CURRENT_VOUCHERS;
  }
  return CURRENT_VOUCHERS.filter((v) => v.category === category);
}
