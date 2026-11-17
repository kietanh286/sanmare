'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Clock,
  Zap,
  ShoppingBag,
  Flame,
  X,
  Gift,
  ArrowRight,
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
  itemId?: string;
  shopId?: string;
  canonicalUrl: string;
  originalUrl: string;
  affiliateUrl: string;
  deeplinkUrl: string;
  vouchers: VoucherItem[];
}

export default function CleanHomePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saleEvent, setSaleEvent] = useState<SaleEvent | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(12);
  const [modalData, setModalData] = useState<ConvertData | null>(null);
  const [copiedAff, setCopiedAff] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Lấy sự kiện sale hôm nay và giờ hiện tại trên client
  useEffect(() => {
    setSaleEvent(getCurrentSaleEvent());
    setCurrentHour(new Date().getHours());
  }, []);

  // Tự động nhận diện clipboard khi người dùng bấm "Dán nhanh"
  const handleQuickPaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setErrorMsg('');
          // Tự động trigger convert nếu là link hợp lệ
          if (/https?:\/\//i.test(text)) {
            triggerConvert(text);
          }
        }
      }
    } catch {
      setErrorMsg('Vui lòng cấp quyền hoặc dán thủ công liên kết vào ô nhập liệu.');
    }
  };

  const triggerConvert = async (urlToProcess: string) => {
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
        throw new Error(res.message || 'Không thể nhận diện liên kết. Hãy thử lại link khác!');
      }

      setModalData(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra trong quá trình xử lý link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg('Vui lòng dán link sản phẩm Shopee, Lazada hoặc TikTok Shop!');
      return;
    }
    triggerConvert(inputUrl);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAff(true);
    setTimeout(() => setCopiedAff(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Banner Sự Kiện Siêu Sale Tự Động */}
      {saleEvent && (
        <div className={`bg-gradient-to-r ${saleEvent.bannerGradient} text-white py-2.5 px-4 shadow-sm`}>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-black tracking-wider text-[11px] uppercase">
                🔥 {saleEvent.name}
              </span>
              <span className="hidden sm:inline font-medium text-white/95">{saleEvent.description}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-white/90">
              <span>Hỗ trợ:</span>
              <span className="px-1.5 py-0.5 bg-white/15 rounded">Shopee</span>
              <span className="px-1.5 py-0.5 bg-white/15 rounded">Lazada</span>
              <span className="px-1.5 py-0.5 bg-white/15 rounded">TikTok Shop</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Header Đơn Giản & Tinh Gọn */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              TIỆM MÃ
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Săn mã tự động</span>
          </div>
        </div>
      </header>

      {/* 3. Main Khu Vực Tìm Kiếm & Dán Link */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-7">
        {/* Tiêu đề ngắn gọn */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dán Link &bull; Nhận Mã &bull; Mua Ngay
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Hỗ trợ Shopee (gắn mã Video 50%), Lazada và TikTok Shop. Tự động chuyển thẳng vào ứng dụng để mua với giá rẻ nhất.
          </p>
        </div>

        {/* Khung Dán Link Tối Ưu */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg shadow-orange-500/5 border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Dán link Shopee, Lazada hoặc TikTok Shop vào đây..."
                className="w-full pl-4 pr-28 py-3.5 sm:py-4 text-sm sm:text-base rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition font-sans text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleQuickPaste}
                className="absolute right-2 top-2 bottom-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-lg flex items-center space-x-1 transition border border-orange-200/60 active:scale-95"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Dán nhanh</span>
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 text-base transition active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý link...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  <span>SĂN MÃ & MUA HÀNG NGAY</span>
                </>
              )}
            </button>
          </form>

          {/* Sàn được hỗ trợ */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center space-x-3 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Hỗ trợ:</span>
            <span className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span>🛍️</span> <span>Shopee</span>
            </span>
            <span className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span>💙</span> <span>Lazada</span>
            </span>
            <span className="flex items-center space-x-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              <span>🎵</span> <span>TikTok Shop</span>
            </span>
          </div>
        </div>

        {/* 4. Các Mốc Giờ Săn Sale Trong Ngày */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Khung Giờ Săn Sale Hôm Nay</span>
            </h2>
            <span className="text-[11px] text-slate-500">Mã mở mới theo giờ</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FLASH_SLOTS.slice(0, 4).map((slot) => {
              const isPassed = currentHour > slot.hour;
              const isCurrent = Math.abs(currentHour - slot.hour) <= 1;

              return (
                <div
                  key={slot.time}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20'
                      : isPassed
                      ? 'bg-white border-slate-200 opacity-75'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-slate-900">{slot.time}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isCurrent ? 'ĐANG SĂN' : slot.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{slot.title}</p>
                  <p className="text-[11px] text-orange-600 font-medium line-clamp-1">{slot.highlight}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hướng Dẫn Nhanh */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Chỉ cần dán link, hệ thống tự động gắn mã ưu đãi và mở App tương ứng.</span>
          </div>
          <span className="font-bold text-orange-600 shrink-0">100% Miễn phí</span>
        </div>
      </main>

      {/* 5. POP-UP MUA HÀNG RÚT GỌN (Theo yêu cầu người dùng) */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-orange-100 space-y-4 animate-in zoom-in-95 duration-200 relative">
            {/* Nút Đóng Pop-up */}
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Pop-up */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{modalData.platformInfo.logo}</span>
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                  Đã Gắn Ưu Đãi Thành Công
                </span>
                <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                  {modalData.productName}
                </h3>
              </div>
            </div>

            {/* Badge Ưu Đãi Nổi Bật */}
            <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/80 space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-700">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Ưu Đãi Sàn: Giảm 15% - 50% + Freeship 0Đ</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mở ứng dụng qua nút bên dưới để mã giảm giá tự động được lưu vào tài khoản của bạn.
              </p>
            </div>

            {/* NÚT BẤM TO DUY NHẤT: MỞ APP MUA NGAY */}
            <div className="space-y-2 pt-1">
              <a
                href={modalData.deeplinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-base sm:text-lg rounded-xl shadow-xl shadow-orange-500/30 flex items-center justify-center space-x-2 transition active:scale-98 text-center ring-4 ring-orange-500/20"
              >
                <span>⚡ MỞ APP {modalData.platformInfo.name.toUpperCase()} MUA NGAY</span>
                <ExternalLink className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(modalData.affiliateUrl)}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition active:scale-95 border border-slate-200"
              >
                {copiedAff ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Đã sao chép link mua hàng!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Sao chép link mua hàng</span>
                  </>
                )}
              </button>
            </div>

            {/* Mã giảm giá áp dụng nhanh (Click để copy) */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Mã giảm giá hot áp dụng ngay:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {modalData.vouchers.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleCopyCode(v.code)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 rounded-md text-xs font-mono font-bold flex items-center space-x-1 transition border border-slate-200"
                  >
                    <span>{v.code}</span>
                    {copiedCode === v.code ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Gọn Gàng */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        Tiệm Mã &bull; Tối ưu săn sale Shopee, Lazada, TikTok Shop
      </footer>
    </div>
  );
}
