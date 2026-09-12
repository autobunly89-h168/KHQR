import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface AdBannerProps {
  slotType?: 'leaderboard' | 'rectangle' | 'infeed' | 'sticky-footer';
  className?: string;
}

// Google AdSense Publisher ID locked permanently in the application
export const GOOGLE_ADSENSE_PUB_ID = 'ca-pub-2027566119468197';

// Reusable Google AdSense display unit that safely invokes adsbygoogle.push
interface GoogleAdUnitProps {
  client: string;
  slot?: string;
  format?: string;
  className?: string;
}

export const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({
  client,
  slot,
  format = 'auto',
  className = ''
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      if (typeof window !== 'undefined') {
        ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px', width: '100%', textAlign: 'center' }}
        data-ad-client={client}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const AdBanner: React.FC<AdBannerProps> = ({
  className = ''
}) => {
  const { lang } = useLanguage();

  return (
    <div
      id="google-adsense-container"
      className={`overflow-hidden rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm p-3 text-center relative ${className}`}
    >
      {/* Header Label - purely informative, strictly read-only with no edit or settings controls */}
      <div className="flex items-center justify-between text-[11px] text-white/60 mb-2 px-1">
        <span className="flex items-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{lang === 'km' ? 'ការផ្សាយពាណិជ្ជកម្ម (Sponsored)' : 'Advertisement'}</span>
        </span>
        <span className="text-[10px] text-white/40 font-mono">
          Google AdSense
        </span>
      </div>

      {/* Google AdSense Display Banner */}
      <div className="min-h-[90px] w-full flex flex-col items-center justify-center bg-black/30 rounded-xl p-2 border border-white/10">
        <GoogleAdUnit client={GOOGLE_ADSENSE_PUB_ID} />
      </div>
    </div>
  );
};
