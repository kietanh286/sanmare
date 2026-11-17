# ⚡ Săn Mã Rẻ (sanmare.site) - 1 Giây Săn Mã • Mở App Mua Rẻ

Website tối ưu chuyển đổi tiếp thị liên kết (Affiliate Marketing) đa sàn: **Shopee**, **Lazada**, **TikTok Shop** với giao diện siêu tối giản (Minimalist), tải siêu tốc và cơ chế mở ứng dụng tự động (Deeplink).

---

## 🌟 Tính Năng Nổi Bật

1. **Dán Link Đa Sàn & Tự Động Bóc Tách**:
   - Nhận diện link rút gọn và link đầy đủ từ Shopee, Lazada, TikTok Shop.
   - Bóc tách tự động tên sản phẩm, hình ảnh thu nhỏ (thumbnail), thông tin shop/sản phẩm.
   - Nút **"Dán nhanh"** 1-click từ bộ nhớ tạm (Clipboard API).

2. **Tích Hợp ACCESSTRADE API Chính Thức**:
   - Tự động chuyển đổi liên kết gốc sang link tiếp thị liên kết rút gọn (`shorten.asia`).
   - Tự động gắn Sub-ID để theo dõi doanh số và đơn hàng minh bạch.
   - Cơ chế Fallback thông minh: Tự gắn tracking UTM nếu API đang xử lý.

3. **Smart Deeplink (Cầu Nối Kích Hoạt Ứng Dụng)**:
   - Tự động tạo URI Scheme mở app trên điện thoại:
     - Shopee: `shopeevn://`
     - Lazada: `lazada://`
     - TikTok Shop: `snssdk1180://`
   - Trang đệm trung gian `/go` giúp người dùng nhảy thẳng vào App gốc mà không bị kẹt ở trình duyệt web ngoài, giữ chân khách hàng và kích hoạt mã giảm giá tối đa.

4. **Bảo Mật API Tuyệt Đối**:
   - Toàn bộ Access Key / Token Accesstrade được bảo vệ tại Next.js Server Route (`/api/convert`), không để lộ bất kỳ thông tin nhạy cảm nào ra trình duyệt phía người dùng.

---

## 🚀 Khởi Chạy Local

```bash
# Cài đặt dependencies
npm install

# Khởi chạy server phát triển
npm run dev
```
Truy cập: `http://localhost:3000`

---

## ⚙️ Biến Môi Trường (Environment Variables)

Sao chép file `.env.example` thành `.env.local` và cập nhật thông tin:

```env
ACCESSTRADE_API_KEY=your_accesstrade_api_key
TIKTOK_CAMPAIGN_ID=6648523843406889655
DEFAULT_AFFILIATE_ID=sanmare_vip
```

> **Lưu ý quan trọng**: File `.env.local` đã nằm trong `.gitignore` để tránh rò rỉ API key khi push code lên GitHub. Khi deploy lên Vercel/Netlify, hãy thêm các biến này vào phần **Environment Variables** của trang quản trị.
