'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Sparkles, ShoppingBag } from 'lucide-react';
import { PLATFORMS, PlatformType } from '@/lib/platforms/resolver';

function RedirectContent() {
  const searchParams = useSearchParams();

  const toUrl = searchParams.get('to') || '';
  const appUrl = searchParams.get('app') || '';
  const platform = (searchParams.get('platform') as PlatformType) || 'shopee';
  const name = searchParams.get('name') || 'Sản phẩm';
  const img = searchParams.get('img') || '';
  const op = searchParams.get('op') || 'Giá niêm yết';
  const dp = searchParams.get('dp') || 'Ưu đãi qua App';

  const [countdown, setCountdown] = useState(2);
  const platformInfo = PLATFORMS[platform] || PLATFORMS.shopee;

  useEffect(() => {
    if (!toUrl && !appUrl) return;

    // 1. Thử kích hoạt App Deeplink ngay lập tức trên thiết bị di động
    if (appUrl) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = appUrl;
      }
    }

    // 2. Tự động chuyển hướng sang link affiliate sau 1.8 giây nếu không mở được app
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FBFBFC] text-slate-800 font-sans">
      <div className="max-w-sm w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 text-center animate-in zoom-in-95 duration-200">
        {/* Logo & Platform Badge */}
        <div className="flex flex-col items-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-200/60 shadow-xs">
            {platformInfo.logo}
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            {platformInfo.name} &bull; Đang Chuyển Tiếp
          </span>
        </div>

        {/* Tiêu đề & Thông báo */}
        <div className="space-y-1">
          <h1 className="text-lg font-black text-slate-900">
            Đang Mở App Để Áp Mã...
          </h1>
          <p className="text-xs text-slate-400">
            Tự động kích hoạt ưu đãi tốt nhất cho đơn hàng của bạn.
          </p>
        </div>

        {/* Thẻ Sản Phẩm Preview Đồng Bộ */}
        <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 text-left flex items-start space-x-3">
          {img ? (
            <img
              src={img}
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-2xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xl border border-amber-200">
              {platformInfo.logo}
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{name}</p>
            <p className="text-[10px] text-slate-400 font-medium">
              Giá chưa giảm: <span className="line-through text-slate-500">{op}</span>
            </p>
            <p className="text-[11px] font-black text-amber-600 flex items-center space-x-1 truncate">
              <Sparkles className="w-3 h-3 text-amber-500 inline shrink-0" />
              <span>{dp}</span>
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-500 py-0.5">
          <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Tự động chuyển tiếp sau {countdown}s</span>
        </div>

        {/* Nút Bấm Thủ Công To Rõ */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleManualOpen}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition active:scale-98"
          >
            <span>⚡ MỞ APP {platformInfo.name.toUpperCase()} NGAY</span>
            <ExternalLink className="w-4 h-4" />
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
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFC]">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
