import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, Tag, Info, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface AdBannerProps {
  slotType: 'leaderboard' | 'rectangle' | 'infeed' | 'sticky-footer';
  className?: string;
  onOpenSettings?: () => void;
}

export interface AdConfig {
  adsenseEnabled: boolean;
  publisherId: string; // e.g. "ca-pub-2027566119468197"
  slotLeaderboard: string;
  slotRectangle: string;
  slotInfeed: string;
  customAffiliateText?: string;
}

export const DEFAULT_AD_CONFIG: AdConfig = {
  adsenseEnabled: true,
  publisherId: 'ca-pub-2027566119468197',
  slotLeaderboard: '',
  slotRectangle: '',
  slotInfeed: '',
  customAffiliateText: ''
};

export const AFFILIATE_PARTNERS = [
  {
    id: 'bakong-pos',
    name: 'KHQR Payment Terminal & Stand',
    titleKh: 'កុម្ម៉ង់ជើងទម្រ KHQR Acrylic & ម៉ាស៊ីន POS',
    titleEn: 'Order KHQR Acrylic Stand & POS Terminal',
    descriptionKh: 'ជើងទម្រស្កេន QR ស្អាតធន់ ធន់នឹងទឹក ស័ក្តិសមសម្រាប់ហាងកាហ្វេ ភោជនីយដ្ឋាន និងអាជីវកម្មគ្រប់ប្រភេទ',
    descriptionEn: 'Durable & waterproof QR stand, ideal for coffee shops, restaurants and merchants',
    tag: 'SPONSORED',
    badge: 'បញ្ចុះតម្លៃ 20%',
    ctaKh: 'មើលផលិតផល',
    ctaEn: 'View Products',
    url: 'https://bakong.nbc.gov.kh',
    accentColor: 'from-amber-500 to-orange-600',
    iconText: 'POS'
  },
  {
    id: 'business-banking',
    name: 'Business Account Perks',
    titleKh: 'បើកគណនីអាជីវកម្ម KHQR ឥតគិតថ្លៃសេវា',
    titleEn: 'Open Zero-Fee KHQR Business Account',
    descriptionKh: 'ទទួលប្រាក់ចូលគណនីភ្លាមៗជាមួយ Bakong KHQR ដោយមិនគិតថ្លៃសេវាប្រតិបត្តិការ ផ្ទេរប្រាក់ឆ្លងធនាគារលឿនបំផុត',
    descriptionEn: 'Receive instant settlements with zero transaction fees and fast interbank transfers',
    tag: 'PARTNER',
    badge: 'ឥតគិតថ្លៃ',
    ctaKh: 'ស្វែងយល់បន្ថែម',
    ctaEn: 'Learn More',
    url: 'https://nbc.gov.kh',
    accentColor: 'from-blue-600 to-indigo-600',
    iconText: 'BANK'
  },
  {
    id: 'merchant-software',
    name: 'Smart POS & Inventory',
    titleKh: 'ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកភ្ជាប់ KHQR',
    titleEn: 'POS & Inventory Sync with KHQR',
    descriptionKh: 'ភ្ជាប់ប្រព័ន្ធលក់ជាមួយ KHQR ស្វ័យប្រវត្តិ មិនបាច់ឲ្យអតិថិជនផ្ញើស្លីប ត្រួតពិនិត្យប្រាក់ចំណូលតាមទូរស័ព្ទ',
    descriptionEn: 'Auto verify customer payments without manual slips. Real-time income dashboard on mobile',
    tag: 'HOT DEAL',
    badge: 'សាកល្បង 30 ថ្ងៃ',
    ctaKh: 'ចុះឈ្មោះសាកល្បង',
    ctaEn: 'Free Trial',
    url: 'https://bakong.nbc.gov.kh',
    accentColor: 'from-emerald-500 to-teal-600',
    iconText: 'ERP'
  }
];

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
        style={{ display: 'block', minHeight: '60px', width: '100%', textAlign: 'center' }}
        data-ad-client={client}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  className = '',
  onOpenSettings
}) => {
  const { lang } = useLanguage();
  const [adConfig, setAdConfig] = useState<AdConfig>(DEFAULT_AD_CONFIG);
  const [currentAffiliateIdx, setCurrentAffiliateIdx] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khqr_ad_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure default publisherId if empty
        if (!parsed.publisherId) {
          parsed.publisherId = DEFAULT_AD_CONFIG.publisherId;
        }
        setAdConfig(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Cycle affiliate deals periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAffiliateIdx((prev) => (prev + 1) % AFFILIATE_PARTNERS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const partner = AFFILIATE_PARTNERS[currentAffiliateIdx];

  // If Google AdSense is enabled and configured, render the Google AdSense unit
  if (adConfig.adsenseEnabled && adConfig.publisherId) {
    const slotId =
      slotType === 'leaderboard'
        ? adConfig.slotLeaderboard
        : slotType === 'rectangle'
        ? adConfig.slotRectangle
        : adConfig.slotInfeed;

    return (
      <div
        className={`overflow-hidden rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm p-3 text-center relative ${className}`}
      >
        <div className="flex items-center justify-between text-[10px] text-white/70 mb-2 px-1">
          <span className="flex items-center gap-1 font-mono uppercase font-semibold">
            <Info className="w-3 h-3 text-amber-300" />
            <span>Google AdSense • {adConfig.publisherId}</span>
          </span>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="hover:text-white transition text-[10px] flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white"
            >
              <Settings className="w-2.5 h-2.5" />
              <span>{lang === 'km' ? 'កំណត់ Ad Slot' : 'Ad Settings'}</span>
            </button>
          )}
        </div>

        {/* Real AdSense Unit */}
        <div className="min-h-[90px] w-full flex flex-col items-center justify-center bg-black/30 rounded-xl p-2 border border-white/10">
          <GoogleAdUnit client={adConfig.publisherId} slot={slotId || undefined} />

          {/* Helper tag if no slotId specified yet (shows Google Auto Ads / Responsive banner notice) */}
          {!slotId && (
            <div className="text-[11px] text-white/60 pt-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {lang === 'km'
                  ? 'AdSense ភ្ជាប់ជោគជ័យ (Auto Ads & Responsive Banner) • ផ្ទាំងពាណិជ្ជកម្មនឹងបង្ហាញដោយស្វ័យប្រវត្តិ'
                  : 'AdSense connected (Auto Ads & Responsive) • Ads will display automatically'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback: Khmer/English affiliate partner / sponsored ad
  const title = lang === 'km' ? partner.titleKh : partner.titleEn;
  const desc = lang === 'km' ? partner.descriptionKh : partner.descriptionEn;
  const cta = lang === 'km' ? partner.ctaKh : partner.ctaEn;

  if (slotType === 'leaderboard') {
    return (
      <div
        id="ad-banner-leaderboard"
        className={`relative overflow-hidden rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm p-3.5 shadow-md group ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Badge & Sponsor Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr ${partner.accentColor} flex items-center justify-center text-white font-black text-xs shadow-md tracking-wider`}
            >
              {partner.iconText}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  {partner.tag}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                  {partner.badge}
                </span>
                <span className="text-[10px] text-white/70 hidden md:inline">
                  • {lang === 'km' ? 'ដៃគូពាណិជ្ជកម្ម' : 'Sponsor'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">
                {title}
              </h4>
              <p className="text-[11px] text-white/80 truncate max-w-md hidden sm:block">
                {desc}
              </p>
            </div>
          </div>

          {/* Action button & settings */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-950 bg-white hover:bg-white/90 shadow-md transition active:scale-95"
            >
              <span>{cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title={lang === 'km' ? 'កំណត់ពាណិជ្ជកម្ម AdSense' : 'AdSense Settings'}
                className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (slotType === 'rectangle') {
    return (
      <div
        id="ad-banner-rectangle"
        className={`relative overflow-hidden rounded-2xl border border-white/15 bg-black/20 backdrop-blur-sm p-4 shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px] text-white/70">
          <span className="flex items-center gap-1 uppercase tracking-wider font-semibold text-amber-300">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'km' ? 'ដៃគូពាណិជ្ជកម្ម (Sponsored)' : 'Sponsored Partner'}</span>
          </span>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-white/70 hover:text-white transition flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded"
            >
              <Settings className="w-3 h-3" />
              <span>{lang === 'km' ? 'កំណត់' : 'Settings'}</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className={`p-3 rounded-xl bg-white/10 border border-white/15`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-sans">
                {partner.badge}
              </span>
              <span className="text-[11px] font-bold text-white truncate">
                {partner.name}
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-200 leading-snug mb-1">
              {title}
            </p>
            <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
              {desc}
            </p>
          </div>

          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-indigo-950 bg-white hover:bg-white/90 transition shadow-md"
          >
            <span>{cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-center gap-1 text-[10px] text-white/60">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'km' ? 'ដៃគូដែលត្រូវបានត្រួតពិនិត្យសុវត្ថិភាព' : 'Verified Partner'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default sticky-footer or infeed
  return (
    <div
      id="ad-banner-footer"
      className={`rounded-xl border border-white/15 bg-black/30 p-2.5 backdrop-blur-md text-xs text-white/80 flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
          ADS
        </span>
        <span className="text-white/90 truncate text-[11px]">
          {title}
        </span>
      </div>
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 underline"
      >
        <span>{cta}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
