import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, Tag, Info, Settings } from 'lucide-react';

export interface AdBannerProps {
  slotType: 'leaderboard' | 'rectangle' | 'infeed' | 'sticky-footer';
  className?: string;
  onOpenSettings?: () => void;
}

export interface AdConfig {
  adsenseEnabled: boolean;
  publisherId: string; // e.g. "ca-pub-xxxxxxxxxxxxxxxx"
  slotLeaderboard: string;
  slotRectangle: string;
  slotInfeed: string;
  customAffiliateText?: string;
}

export const DEFAULT_AD_CONFIG: AdConfig = {
  adsenseEnabled: false,
  publisherId: '',
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
    description: 'ជើងទម្រស្កេន QR ស្អាតធន់ ធន់នឹងទឹក ស័ក្តិសមសម្រាប់ហាងកាហ្វេ ភោជនីយដ្ឋាន និងអាជីវកម្មគ្រប់ប្រភេទ',
    tag: 'SPONSORED',
    badge: 'បញ្ចុះតម្លៃ 20%',
    ctaKh: 'មើលផលិតផល',
    url: 'https://bakong.nbc.gov.kh',
    accentColor: 'from-amber-500 to-orange-600',
    iconText: 'POS'
  },
  {
    id: 'business-banking',
    name: 'Business Account Perks',
    titleKh: 'បើកគណនីអាជីវកម្ម KHQR ឥតគិតថ្លៃសេវា',
    description: 'ទទួលប្រាក់ចូលគណនីភ្លាមៗជាមួយ Bakong KHQR ដោយមិនគិតថ្លៃសេវាប្រតិបត្តិការ ផ្ទេរប្រាក់ឆ្លងធនាគារលឿនបំផុត',
    tag: 'PARTNER',
    badge: 'ឥតគិតថ្លៃ',
    ctaKh: 'ស្វែងយល់បន្ថែម',
    url: 'https://nbc.gov.kh',
    accentColor: 'from-blue-600 to-indigo-600',
    iconText: 'BANK'
  },
  {
    id: 'merchant-software',
    name: 'Smart POS & Inventory',
    titleKh: 'ប្រព័ន្ធគ្រប់គ្រងការលក់ និងស្តុកភ្ជាប់ KHQR',
    description: 'ភ្ជាប់ប្រព័ន្ធលក់ជាមួយ KHQR ស្វ័យប្រវត្តិ មិនបាច់ឲ្យអតិថិជនផ្ញើស្លីប ត្រួតពិនិត្យប្រាក់ចំណូលតាមទូរស័ព្ទ',
    tag: 'HOT DEAL',
    badge: 'សាកល្បង 30 ថ្ងៃ',
    ctaKh: 'ចុះឈ្មោះសាកល្បង',
    url: 'https://bakong.nbc.gov.kh',
    accentColor: 'from-emerald-500 to-teal-600',
    iconText: 'ERP'
  }
];

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  className = '',
  onOpenSettings
}) => {
  const [adConfig, setAdConfig] = useState<AdConfig>(DEFAULT_AD_CONFIG);
  const [currentAffiliateIdx, setCurrentAffiliateIdx] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khqr_ad_config');
      if (saved) {
        setAdConfig(JSON.parse(saved));
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

  // If Google AdSense is enabled and configured, render the standard Google Ads ins
  if (adConfig.adsenseEnabled && adConfig.publisherId) {
    const slotId =
      slotType === 'leaderboard'
        ? adConfig.slotLeaderboard
        : slotType === 'rectangle'
        ? adConfig.slotRectangle
        : adConfig.slotInfeed;

    return (
      <div className={`overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60 p-2 text-center relative ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 px-1">
          <span className="flex items-center gap-1 font-mono uppercase">
            <Info className="w-3 h-3" />
            <span>AdSense Sponsor</span>
          </span>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="hover:text-slate-300 transition text-[10px] flex items-center gap-1"
            >
              <Settings className="w-2.5 h-2.5" />
              <span>កំណត់កូដ</span>
            </button>
          )}
        </div>
        
        {/* Google AdSense container */}
        <div className="min-h-[90px] flex items-center justify-center bg-slate-950/40 rounded-lg p-2">
          {slotId ? (
            <div className="w-full text-center">
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adConfig.publisherId}
                data-ad-slot={slotId}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
              <span className="text-[10px] text-slate-600 font-mono">
                Google AdSense Unit ({slotId})
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-4">
              Google AdSense: សូមកំណត់ Ad Slot ID សម្រាប់ {slotType}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback: Highly polished Khmer affiliate partner / sponsored ad
  if (slotType === 'leaderboard') {
    return (
      <div
        id="ad-banner-leaderboard"
        className={`relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-3 shadow-md shadow-purple-950/20 group ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Badge & Sponsor Info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr ${partner.accentColor} flex items-center justify-center text-white font-black text-xs shadow-md tracking-wider`}>
              {partner.iconText}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  {partner.tag}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {partner.badge}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  • ដៃគូពាណិជ្ជកម្ម
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate hover:text-purple-200 transition">
                {partner.titleKh}
              </h4>
              <p className="text-[11px] text-slate-400 truncate max-w-md hidden sm:block">
                {partner.description}
              </p>
            </div>
          </div>

          {/* Action button & settings */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition active:scale-95"
            >
              <span>{partner.ctaKh}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                title="កំណត់ពាណិជ្ជកម្ម AdSense / Affiliate"
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
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
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 uppercase tracking-wider font-semibold text-purple-400">
            <Sparkles className="w-3 h-3" />
            <span>ដៃគូពាណិជ្ជកម្ម (Sponsored)</span>
          </span>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>កែប្រែ</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${partner.accentColor}/10 border border-purple-500/20`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-sans">
                {partner.badge}
              </span>
              <span className="text-[11px] font-bold text-white truncate">
                {partner.name}
              </span>
            </div>
            <p className="text-xs font-semibold text-purple-200 leading-snug mb-1">
              {partner.titleKh}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {partner.description}
            </p>
          </div>

          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-md shadow-purple-900/30"
          >
            <span>{partner.ctaKh}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>ដៃគូដែលត្រូវបានត្រួតពិនិត្យសុវត្ថិភាព</span>
          </div>
        </div>
      </div>
    );
  }

  // Default sticky-footer or infeed
  return (
    <div
      id="ad-banner-footer"
      className={`rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 backdrop-blur-md text-xs text-slate-300 flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
          ADS
        </span>
        <span className="text-slate-300 truncate text-[11px]">
          {partner.titleKh}
        </span>
      </div>
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 underline"
      >
        <span>{partner.ctaKh}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
