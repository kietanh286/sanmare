'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { PLATFORMS, PlatformType } from '@/lib/platforms/resolver';

function RedirectContent() {
  const searchParams = useSearchParams();

  const toUrl = searchParams.get('to') || '';
  const appUrl = searchParams.get('app') || '';
  const platform = (searchParams.get('platform') as PlatformType) || 'shopee';
  const name = searchParams.get('name') || 'Sản phẩm';

  const [countdown, setCountdown] = useState(2);
  const platformInfo = PLATFORMS[platform] || PLATFORMS.shopee;

  useEffect(() => {
    if (!toUrl && !appUrl) return;

    // 1. Thử kích hoạt App Deeplink ngay lập tức trên thiết bị di động
    if (appUrl) {
      // Dùng iframe ẩn hoặc gán location để kích hoạt pop-up mở App của hệ điều hành
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = appUrl;
      }
    }

    // 2. Tự động chuyển hướng sang link affiliate sau 1.5 giây nếu không mở được app
    const timer = setTimeout(() => {
      if (toUrl) {
        window.location.href = toUrl;
      }
    }, 1800);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [toUrl, appUrl]);

  const handleManualOpen = () => {
    // Ưu tiên deeplink mở app nếu có, fallback sang toUrl
    if (appUrl && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = appUrl;
      setTimeout(() => {
        if (toUrl) window.location.href = toUrl;
      }, 1000);
    } else if (toUrl) {
      window.location.href = toUrl;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        {/* Logo & Platform Badge */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 text-white animate-bounce">
            {platformInfo.logo}
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            {platformInfo.name} Affiliate
          </span>
        </div>

        {/* Tiêu đề & Thông báo */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Đang Chuyển Sang Ứng Dụng...
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hệ thống đang tự động kích hoạt voucher ưu đãi và mở App {platformInfo.name} cho bạn.
          </p>
        </div>

        {/* Thẻ Sản Phẩm Preview */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 font-medium">Sản phẩm đang chọn:</p>
            <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600 py-1">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Tự động chuyển tiếp sau {countdown}s</span>
        </div>

        {/* Nút Bấm Thủ Công To Rõ */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleManualOpen}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition active:scale-98"
          >
            <span>⚡ MỞ APP {platformInfo.name.toUpperCase()} NGAY</span>
            <ExternalLink className="w-5 h-5" />
          </button>

          <p className="text-[11px] text-slate-400">
            Nếu ứng dụng không tự động bật, hãy bấm vào nút trên.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SmartRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
