'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardPaste,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ShoppingBag,
  X,
  Clock,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { FLASH_SLOTS, getCurrentSaleEvent, SaleEvent } from '@/lib/events/sale-calendar';
import { VoucherItem } from '@/lib/vouchers/data';

interface ConvertData {
  platform: string;
  platformInfo: {
    name: string;
    logo: string;
    brandColor: string;
  };
  productName: string;
  productImage?: string;
  originalPrice?: string;
  discountedPrice?: string;
  description?: string;
  itemId?: string;
  shopId?: string;
  canonicalUrl: string;
  originalUrl: string;
  affiliateUrl: string;
  deeplinkUrl: string;
  isAccesstrade?: boolean;
  vouchers: VoucherItem[];
}

export default function MinimalistApp() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalData, setModalData] = useState<ConvertData | null>(null);
  const [copiedAff, setCopiedAff] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(12);
  const [saleEvent, setSaleEvent] = useState<SaleEvent | null>(null);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
    setSaleEvent(getCurrentSaleEvent());
  }, []);

  const triggerConvert = async (urlToProcess: string) => {
    if (!urlToProcess.trim()) {
      setErrorMsg('Vui lòng dán link Shopee, Lazada hoặc TikTok Shop!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToProcess.trim() }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || 'Không thể bóc tách link. Hãy kiểm tra lại link sản phẩm!');
      }

      setModalData(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Hãy thử lại link khác.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setErrorMsg('');
          if (/https?:\/\//i.test(text)) {
            triggerConvert(text);
          }
        }
      }
    } catch {
      setErrorMsg('Vui lòng dán thủ công liên kết vào ô bên dưới.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConvert(inputUrl);
  };

  const handleCopyLink = (data: ConvertData) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const bridgeUrl = `${origin}/go?to=${encodeURIComponent(data.affiliateUrl)}&app=${encodeURIComponent(data.deeplinkUrl)}&platform=${data.platform}&name=${encodeURIComponent(data.productName)}&img=${encodeURIComponent(data.productImage || '')}&op=${encodeURIComponent(data.originalPrice || '')}&dp=${encodeURIComponent(data.discountedPrice || '')}`;

    navigator.clipboard.writeText(bridgeUrl);
    setCopiedAff(true);
    setTimeout(() => setCopiedAff(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Mốc giờ sale gần nhất
  const upcomingSlot = FLASH_SLOTS.find((s) => s.hour >= currentHour) || FLASH_SLOTS[0];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBFBFC] text-slate-800 selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* 1. Header Tối Giản */}
      <header className="px-5 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-amber-500/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
              SĂN MÃ RẺ
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              sanmare.site
            </span>
          </div>
        </div>

        {/* Badge sự kiện sale */}
        {saleEvent && (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            ⚡ {saleEvent.name}
          </span>
        )}
      </header>

      {/* 2. Hero Trọng Tâm: Dán Link & Bật Mua Ngay */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto w-full space-y-6">
        {/* Brand Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            1 Giây Săn Mã • Mở App Mua Rẻ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Dán link Shopee, Lazada hoặc TikTok Shop → Tự động kích hoạt ưu đãi tốt nhất.
          </p>
        </div>

        {/* Ô Input Trọng Tâm */}
        <div className="w-full bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-slate-200/50 border border-slate-200/80 transition-all focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/10">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Dán link sản phẩm vào đây..."
                className="w-full pl-4 pr-24 py-3.5 sm:py-4 text-sm sm:text-base rounded-xl outline-none text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={handleQuickPaste}
                className="absolute right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center space-x-1 transition active:scale-95"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Dán nhanh</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 mx-1">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-5 bg-slate-900 hover:bg-black text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-slate-900/15 flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang bóc tách thông tin sản phẩm...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Săn Mã & Mở Mua Ngay</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Badge 3 sàn */}
        <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium pt-1">
          <span className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
            <span>🛍️</span> <span>Shopee</span>
          </span>
          <span className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
            <span>💙</span> <span>Lazada</span>
          </span>
          <span className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">
            <span>🎵</span> <span>TikTok Shop</span>
          </span>
        </div>

        {/* Mốc giờ Flash Sale tiếp theo */}
        <div className="w-full bg-white rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Mốc giờ sale tới: <strong>{upcomingSlot.time}</strong></span>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            {upcomingSlot.title}
          </span>
        </div>
      </main>

      {/* 3. Pop-up Mua Hàng Hiển Thị Thông Tin Sản Phẩm & Mức Giá */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150 relative">
            {/* Nút Đóng */}
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Sàn */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">{modalData.platformInfo.logo}</span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                {modalData.platformInfo.name} • Đã Kích Hoạt Ưu Đãi
              </span>
            </div>

            {/* Khối Thông Tin Sản Phẩm + Ảnh + Mức Giá */}
            <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 flex items-start space-x-3.5">
              {/* Ảnh Thumbnail Sản Phẩm */}
              {modalData.productImage ? (
                <img
                  src={modalData.productImage}
                  alt={modalData.productName}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-2xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-2xl border border-amber-200">
                  {modalData.platformInfo.logo}
                </div>
              )}

              {/* Chi Tiết Sản Phẩm & Mức Giá */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {modalData.productName}
                </h3>

                {/* Khối Mức Giá */}
                <div className="flex flex-col text-xs pt-0.5">
                  {/* Chỉ hiện giá gốc nếu là số thực, không hiện placeholder */}
                  {modalData.originalPrice && !modalData.originalPrice.includes('niêm yết') && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Giá gốc: <span className="line-through text-slate-500 font-semibold">{modalData.originalPrice}</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-amber-600 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 inline shrink-0" />
                    <span>{modalData.discountedPrice || 'Giảm giá tốt nhất khi mở App'}</span>
                  </span>
                </div>

                {/* Miêu tả ngắn gọn */}
                {modalData.description && (
                  <p className="text-[11px] text-slate-400 font-normal truncate pt-0.5">
                    {modalData.description}
                  </p>
                )}
              </div>
            </div>

            {/* NÚT BẤM TO CHÍNH: MỞ APP MUA NGAY */}
            <div className="space-y-2 pt-1">
              <a
                href={`/go?to=${encodeURIComponent(modalData.affiliateUrl)}&app=${encodeURIComponent(modalData.deeplinkUrl)}&platform=${modalData.platform}&name=${encodeURIComponent(modalData.productName)}&img=${encodeURIComponent(modalData.productImage || '')}&op=${encodeURIComponent(modalData.originalPrice || '')}&dp=${encodeURIComponent(modalData.discountedPrice || '')}`}
                className="w-full py-4 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition active:scale-98 text-center ring-4 ring-amber-500/15"
              >
                <span>⚡ MỞ APP {modalData.platformInfo.name.toUpperCase()} MUA NGAY</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(modalData)}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition active:scale-95 border border-slate-200/80"
              >
                {copiedAff ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã chép link mở app!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sao chép link mua</span>
                  </>
                )}
              </button>
            </div>

            {/* Mã giảm giá áp dụng nhanh */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Mã hot:</span>
              <div className="flex space-x-1.5">
                {modalData.vouchers.slice(0, 2).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleCopyCode(v.code)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded-md text-[11px] font-mono font-bold transition flex items-center space-x-1"
                  >
                    <span>{v.code}</span>
                    {copiedCode === v.code ? (
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-2.5 h-2.5 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer Tối Giản */}
      <footer className="py-4 text-center text-[11px] text-slate-400">
        sanmare.site • Săn Mã Rẻ © 2026 • Tối giản • Nhanh chóng • Miễn phí
      </footer>
    </div>
  );
}
