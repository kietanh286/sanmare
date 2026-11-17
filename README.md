# 🛍️ Tiệm Mã - Hệ Thống Săn Mã Giảm Giá & Tạo Link Affiliate Shopee Tự Động

Ứng dụng web tối ưu chuyển đổi tiếp thị liên kết (Affiliate Marketing) tương tự mô hình `tiemma.com`.

---

## 🌟 Tính Năng Nổi Bật (Giai đoạn 1 - MVP)

1. **Dán link & Tự động bóc tách (Link Resolver)**:
   - Tiếp nhận link rút gọn từ điện thoại: `s.shopee.vn/...`, `shope.ee/...`, `vn.shp.ee/...`, `shopee.vn/...`.
   - Tự động theo dõi chuyển hướng (Redirect HTTP) để bóc tách **Item ID**, **Shop ID** và tên sản phẩm.
   - Hỗ trợ nút **"Dán nhanh"** tự động đọc từ bộ nhớ tạm (Clipboard API).
2. **Tự động gắn mã Affiliate (Affiliate Converter)**:
   - **Chế độ chính thức**: Kết nối trực tiếp Shopee Open Platform qua chuẩn GraphQL / REST với chữ ký bảo mật HMAC-SHA256.
   - **Chế độ dự phòng (Fallback)**: Tự động gắn mã tracking `sub_id`, `utm_source`, `utm_campaign` khi chưa có hoặc đang chờ duyệt API key.
3. **Deeplink App Shopee**:
   - Tự động tạo link dạng `shopeevn://product?shopId=...&itemId=...`.
   - Khi người dùng bấm nút trên điện thoại, hệ thống mở thẳng ứng dụng Shopee (không bị kẹt ở trình duyệt web ngoài), tối ưu tối đa tỷ lệ mua hàng.
4. **Kho Mã Giảm Giá Tổng Hợp**:
   - Phân loại rõ ràng: Mã Shopee Video (giảm 20% - 50%), Mã Freeship Xtra, Mã Khung giờ vàng (0h, 9h, 12h, 15h, 18h, 20h), Mã ShopeePay.
   - Sao chép mã 1-click có hiệu ứng thông báo trực quan.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy môi trường phát triển (Development)
```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy dev server
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:3000`

### 2. Biên dịch Production
```bash
npm run build
npm run start
```

---

## ⚙️ Cấu Hình API Shopee Affiliate (`.env.local`)

Mở file `.env.local` tại thư mục gốc để cấu hình:

```env
# 1. Sau khi đăng ký tài khoản tại https://affiliate.shopee.vn/ và được cấp Open API:
SHOPEE_APP_ID=YOUR_APP_ID_HERE
SHOPEE_SECRET_KEY=YOUR_SECRET_KEY_HERE

# 2. Mã tracking định danh của bạn (sẽ xuất hiện trong báo cáo hoa hồng của Shopee):
DEFAULT_AFFILIATE_ID=tiemma_vip

# 3. Giữ true để hệ thống tự động fallback nếu API Shopee bảo trì hoặc chưa cấu hình key:
ENABLE_FALLBACK_MODE=true
```

---

## 🌐 Hướng Dẫn Deploy Lên Vercel (Miễn Phí)

1. Đẩy code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: shopee voucher affiliate mvp"
   git remote add origin https://github.com/username/ten-repo.git
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com) -> Chọn **Add New Project** -> Chọn repository vừa push.
3. Thêm các biến môi trường từ `.env.local` vào mục **Environment Variables** trên Vercel.
4. Bấm **Deploy** $\rightarrow$ Bạn sẽ có ngay một trang web online chạy 24/7 với tên miền miễn phí `.vercel.app` hoặc gắn tên miền riêng tuỳ thích.
