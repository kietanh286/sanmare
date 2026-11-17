import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mã Vàng - 1 Giây Săn Mã &bull; Mở App Mua Rẻ',
  description:
    'Công cụ tối giản giúp dán link Shopee, Lazada, TikTok Shop để tự động kích hoạt mã giảm giá Video 50%, Freeship 0Đ và mở app mua hàng ngay lập tức.',
  keywords: [
    'mã vàng',
    'săn mã',
    'mã giảm giá shopee',
    'mã video tiktok',
    'lazada affiliate',
    'voucher giảm giá',
  ],
  authors: [{ name: 'Mã Vàng' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFC] text-slate-800 font-sans">
        {children}
      </body>
    </html>
  );
}
