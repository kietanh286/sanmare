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
  title: 'Tiệm Mã - Săn Mã Giảm Giá Shopee & Mở App Ưu Đãi 50%',
  description:
    'Công cụ tìm mã giảm giá Shopee tự động. Dán link sản phẩm để lấy mã Shopee Video, Freeship Xtra và mở app mua hàng với giá tốt nhất.',
  keywords: [
    'tiệm mã',
    'mã giảm giá shopee',
    'săn mã shopee',
    'mã video shopee',
    'mã freeship shopee',
    'shopee affiliate',
  ],
  authors: [{ name: 'Tiệm Mã' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
