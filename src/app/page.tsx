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
  ShieldCheck,
  Zap,
  ShoppingBag,
  Info,
  Flame,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { VoucherItem } from '@/lib/vouchers/data';

interface ConversionResult {
  product: {
    productName: string;
    itemId?: string;
    shopId?: string;
    canonicalUrl: string;
    originalUrl: string;
  };
  affiliate: {
    affiliateUrl: string;
    deeplinkUrl: string;
    isApiGenerated: boolean;
    subId: string;
  };
  vouchers: VoucherItem[];
}

export default function HomePage() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAffLink, setCopiedAffLink] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);

  // Tải danh sách voucher ban đầu
  useEffect(() => {
    fetch('/api/vouchers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVouchers(data.vouchers);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Xử lý dán nhanh từ clipboard
  const handleQuickPaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setErrorMsg('');
        }
      }
    } catch {
      setErrorMsg('Không thể truy cập bộ nhớ tạm. Vui lòng dán thủ công vào ô nhập liệu.');
    }
  };

  // Xử lý gửi link chuyển đổi
  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg('Vui lòng nhập hoặc dán link sản phẩm Shopee!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể xử lý link này. Vui lòng kiểm tra lại!');
      }

      setResult(data);
      if (data.vouchers && data.vouchers.length > 0) {
        setVouchers(data.vouchers);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Hãy thử lại sau ít phút.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sao chép mã voucher
  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Sao chép link Affiliate
  const handleCopyAffLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedAffLink(true);
    setTimeout(() => setCopiedAffLink(false), 2500);
  };

  // Lọc voucher hiển thị
  const filteredVouchers = vouchers.filter((v) => {
    if (activeCategory === 'all') return true;
    return v.category === activeCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20 text-white">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                TIỆM MÃ
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                Săn Deal Shopee
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs sm:text-sm font-medium text-slate-600">
            <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
              Cập nhật mã: 20:00
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs sm:text-sm font-medium border border-orange-200/60">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Tự động kích hoạt mã Shopee Video giảm đến 50%</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dán Link Sản Phẩm <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Nhận Mã Giảm Giá & Link Ưu Đãi
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Hệ thống tự động giải mã liên kết, bóc tách voucher tốt nhất và tạo đường dẫn mở thẳng App Shopee để bạn áp mã tiết kiệm nhất.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-orange-500/5 border border-orange-100 p-4 sm:p-6">
          <form onSubmit={handleConvert} className="space-y-4">
            <div className="relative">
              <label htmlFor="shopee-url" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Nhập hoặc dán link sản phẩm Shopee:
              </label>
              <div className="relative flex items-center">
                <input
                  id="shopee-url"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="https://s.shopee.vn/... hoặc https://shopee.vn/product/..."
                  className="w-full pl-4 pr-28 sm:pr-32 py-3.5 sm:py-4 text-sm sm:text-base rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleQuickPaste}
                  className="absolute right-2.5 px-3 py-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg flex items-center space-x-1 transition-colors border border-orange-200/80 active:scale-95"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Dán nhanh</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start space-x-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang bóc tách mã & tạo link...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Săn Mã & Lấy Link Ưu Đãi</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Card (When Converted) */}
        {result && (
          <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-white rounded-2xl border-2 border-orange-300 p-5 sm:p-7 shadow-lg shadow-orange-500/10 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/70">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm sm:text-base">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </div>
                <span>Đã bóc tách thành công sản phẩm!</span>
              </div>
              <span className="text-xs text-orange-800 bg-orange-100/90 font-medium px-2.5 py-0.5 rounded-full border border-orange-200">
                {result.affiliate.isApiGenerated ? 'Shopee Official API' : 'Auto Tracking Deeplink'}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-orange-600 shrink-0" />
                <span className="line-clamp-2">{result.product.productName}</span>
              </h3>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600">
                {result.product.shopId && (
                  <span className="bg-white/80 px-2 py-1 rounded-md border border-slate-200">
                    Shop ID: <strong className="text-slate-800">{result.product.shopId}</strong>
                  </span>
                )}
                {result.product.itemId && (
                  <span className="bg-white/80 px-2 py-1 rounded-md border border-slate-200">
                    Item ID: <strong className="text-slate-800">{result.product.itemId}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={result.affiliate.deeplinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-xl shadow-red-500/25 flex items-center justify-center space-x-2 transform transition active:scale-98 text-center ring-4 ring-orange-500/20"
              >
                <span>⚡ MỞ APP SHOPEE MUA NGAY</span>
                <ExternalLink className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyAffLink(result.affiliate.affiliateUrl)}
                className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 font-semibold rounded-xl flex items-center justify-center space-x-2 transition active:scale-95"
              >
                {copiedAffLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 text-sm">Đã sao chép link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">Sao chép link mua</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-center text-slate-500 italic">
              💡 Mẹo: Nhấn nút <strong>&quot;MỞ APP SHOPEE MUA NGAY&quot;</strong> để hệ thống tự động lưu voucher và đưa bạn vào đúng sản phẩm trong ứng dụng.
            </p>
          </div>
        )}

        {/* Voucher Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <span>Kho Mã Giảm Giá Shopee Đang Áp Dụng</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Lưu mã hoặc sao chép mã trước khi thanh toán trong giỏ hàng
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'video', label: 'Shopee Video' },
                { id: 'freeship', label: 'Freeship Xtra' },
                { id: 'all_slot', label: 'Toàn sàn' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id === 'all_slot' ? 'all' : tab.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    (activeCategory === tab.id || (tab.id === 'all_slot' && activeCategory === 'all'))
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voucher Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                {voucher.badge && (
                  <span className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg tracking-wider uppercase">
                    {voucher.badge}
                  </span>
                )}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                      {voucher.categoryLabel}
                    </span>
                    {voucher.timeSlot && (
                      <span className="text-[11px] text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {voucher.timeSlot}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">{voucher.title}</h4>
                  <p className="text-orange-600 font-extrabold text-sm">{voucher.discount}</p>
                  <p className="text-xs text-slate-500">{voucher.minSpend}</p>
                  {voucher.note && <p className="text-[11px] text-slate-400 italic">{voucher.note}</p>}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded border border-slate-200">
                    {voucher.code}
                  </div>

                  <button
                    onClick={() => handleCopyVoucher(voucher.code)}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition active:scale-95 border border-orange-200/80"
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép mã!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Steps Guide Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Cách Săn Mã Giảm Giá Shopee Cực Đơn Giản
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Chỉ với 3 bước là bạn có thể tiết kiệm ngay từ 20.000đ đến 100.000đ cho mỗi đơn hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-black text-lg flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Copy Link Sản Phẩm</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mở ứng dụng Shopee, tìm món hàng muốn mua và bấm vào biểu tượng <strong>Chia sẻ</strong> &rarr; Chọn <strong>Sao chép liên kết</strong>.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-black text-lg flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Dán Vào Tiệm Mã</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dán đường link vào ô tìm kiếm ở trên và bấm <strong>Săn Mã & Lấy Link Ưu Đãi</strong> để hệ thống tự động bóc tách.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-black text-lg flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Mở App & Đặt Hàng</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhấn <strong>Mở App Shopee Mua Ngay</strong>, voucher sẽ tự động có sẵn trong giỏ hàng để bạn áp dụng khi thanh toán.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h5 className="font-bold text-xs text-slate-800">Miễn Phí 100%</h5>
            <p className="text-[11px] text-slate-500">Không thu phí, không cần đăng nhập tài khoản</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center space-y-1">
            <Zap className="w-6 h-6 text-amber-500" />
            <h5 className="font-bold text-xs text-slate-800">Xử Lý Tức Thì</h5>
            <p className="text-[11px] text-slate-500">Chuyển đổi link và lọc mã chỉ trong 0.5 giây</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center space-y-1">
            <Layers className="w-6 h-6 text-orange-600" />
            <h5 className="font-bold text-xs text-slate-800">Mã Cập Nhật Liên Tục</h5>
            <p className="text-[11px] text-slate-500">Tự động làm mới theo từng khung giờ flash sale</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-700">
          Tiệm Mã &copy; 2026 - Công cụ hỗ trợ tìm kiếm mã giảm giá và tối ưu mua sắm Shopee.
        </p>
        <p className="max-w-md mx-auto text-[11px] text-slate-400">
          Tiệm Mã không trực tiếp bán hàng và không phải sàn thương mại điện tử. Tất cả giao dịch mua bán và thanh toán đều diễn ra trực tiếp trên ứng dụng Shopee.
        </p>
      </footer>
    </div>
  );
}
