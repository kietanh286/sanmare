# Shopee Voucher & Affiliate Link Generator (MVP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng web MVP săn mã giảm giá và tạo affiliate link Shopee tự động (tương tự `tiemma.com`), hỗ trợ dán link sản phẩm, tự động nhận diện clipboard, bóc tách `item_id`/`shop_id`, tạo link affiliate + deeplink mở thẳng app Shopee, đồng thời hiển thị danh sách voucher tổng hợp theo khung giờ.

**Architecture:** 
- Fullstack Next.js (App Router) với Tailwind CSS thiết kế mobile-first.
- Backend API Routes (`/api/convert`, `/api/vouchers`) đảm nhận xử lý link rút gọn Shopee (follow redirect HTTP HEAD), bóc tách Item ID/Shop ID, ký HMAC-SHA256 kết nối Shopee Affiliate API (với chế độ fallback thông minh khi chưa có API key), và trả về danh sách voucher kèm deeplink `shopeevn://...`.
- Frontend trang chủ với ô tìm kiếm lớn, nút dán link từ clipboard (Navigator Clipboard API), preview sản phẩm, thẻ voucher sao chép mã 1-click, và nút CTA nổi bật mở trực tiếp ứng dụng Shopee.

**Tech Stack:** 
- Next.js, TypeScript, Tailwind CSS, Lucide React.
- Node.js `fetch` & `crypto` (HMAC-SHA256 cho Shopee Open API).

## Global Constraints
- Node version: 18+ (hiện tại máy có Node v24.19.0).
- Hoạt động mượt mà trên trình duyệt di động (iOS Safari, Android Chrome) và Desktop.
- Cấu hình `.env.local` linh hoạt: hỗ trợ cả khi có `SHOPEE_APP_ID`/`SHOPEE_SECRET_KEY` lẫn khi chạy ở chế độ fallback/mock affiliate.

---

## Tasks

### Task 1: Khởi tạo dự án Next.js & Tailwind CSS
- [x] Khởi tạo project Next.js bằng `create-next-app` trong thư mục workspace `d:\Job` với TypeScript, Tailwind CSS, App Router, ESLint.
- [x] Cài đặt thư viện icon `lucide-react`.
- [x] Cấu hình file `.env.example` và `.env.local` mẫu chứa cấu hình Shopee Affiliate (`SHOPEE_APP_ID`, `SHOPEE_SECRET_KEY`, `DEFAULT_AFFILIATE_ID`).

### Task 2: Xây dựng Core Logic Backend - Shopee Link Resolver & Affiliate Generator
- [x] Xây dựng module `lib/shopee/resolver.ts`:
  - Nhận diện URL Shopee (`s.shopee.vn`, `shope.ee`, `vn.shp.ee`, `shopee.vn/...`).
  - Follow redirect để lấy canonical URL.
  - Regex trích xuất `itemId` và `shopId`.
- [x] Xây dựng module `lib/shopee/affiliate.ts`:
  - Tính chữ ký HMAC-SHA256 theo chuẩn Shopee Open Platform GraphQL / REST API.
  - Hàm `generateAffiliateLink`: Nếu có API key -> Gọi Shopee API; Nếu không có API key -> Tạo link tracking fallback kèm deeplink app Shopee (`shopeevn://`).
- [x] Xây dựng API route `app/api/convert/route.ts`:
  - POST request nhận `url`.
  - Trả về: `originalUrl`, `canonicalUrl`, `itemId`, `shopId`, `affiliateUrl`, `deeplinkUrl`, `mockProductInfo`.
- [x] Viết test tự động kiểm tra module resolver bằng Node test runner.

### Task 3: Xây dựng Module Voucher Aggregator
- [x] Xây dựng module `lib/vouchers/data.ts`:
  - Lưu trữ danh sách voucher theo các khung giờ hot của Shopee (0h, 9h, 12h, 15h, 18h, 20h): Mã Freeship, Mã Shopee Video, Mã giảm giá toàn sàn, Giảm giá theo ngành hàng.
- [x] Xây dựng API route `app/api/vouchers/route.ts`:
  - Lọc voucher theo trạng thái khả dụng, khung giờ hiện tại và danh mục sản phẩm (nếu có).

### Task 4: Xây dựng Giao diện Người dùng (UI / UX Mobile-first)
- [x] Xây dựng Header: Logo thương hiệu, slogan săn mã & link affiliate.
- [x] Xây dựng Banner/Hero Section với ô Input dán link:
  - Tự động nhận diện clipboard (nút "Dán nhanh từ bộ nhớ tạm").
  - Nút "Tìm mã & Nhận ưu đãi" có trạng thái loading spinner.
- [x] Xây dựng Khối Kết quả Sản phẩm & CTA Mua hàng:
  - Hiển thị card thông tin sản phẩm đã bóc tách.
  - Nút lớn nổi bật: "⚡ MỞ APP SHOPEE MUA NGAY (Đã gắn ưu đãi)".
  - Nút phụ: "Sao chép link mua hàng".
- [x] Xây dựng Khối Danh sách Mã giảm giá:
  - Phân loại tab: Tất cả, Mã Shopee Video, Mã Freeship, Khung giờ vàng.
  - Thẻ voucher có nút "Sao chép mã" hoặc "Lưu mã trên App".
- [x] Xây dựng Footer & Hướng dẫn sử dụng: Hướng dẫn 3 bước đơn giản (Copy link -> Dán -> Mở app săn sale).

### Task 5: Kiểm thử toàn diện & Hướng dẫn chạy/deploy
- [x] Chạy build test (`npm run build`) đảm bảo không có lỗi type/lint.
- [x] Khởi chạy dev server (`npm run dev`) kiểm tra thực tế:
  - Test dán link Shopee thật dạng rút gọn (`s.shopee.vn`, `shope.ee`).
  - Kiểm tra xem link deeplink `shopeevn://` và link web hoạt động chuẩn.
  - Kiểm tra giao diện responsive trên mobile viewport.
- [x] Viết tài liệu `README.md` hướng dẫn cấu hình API Shopee thật khi tài khoản được duyệt và hướng dẫn deploy miễn phí lên Vercel.
