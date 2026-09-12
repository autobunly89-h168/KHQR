import React, { useState } from 'react';
import { Copy, Check, Building2, User, CreditCard, DollarSign, Share2, CheckCircle2 } from 'lucide-react';
import { KhqrParseResult, BANK_THEMES } from '../utils/khqrParser';
import { useLanguage } from '../context/LanguageContext';

interface ScanResultCardProps {
  result: KhqrParseResult | null;
  activeNumber: string;
  onSelectNumber: (num: string) => void;
  onClear: () => void;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  result,
  activeNumber,
  onSelectNumber,
  onClear
}) => {
  const { t, lang } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllSummary = () => {
    if (!result) return;
    const lines = [
      `${t.bankNameLabel}: ${result.bankName || 'KHQR'}`,
      `${t.accountNameLabel}: ${result.accountName || '—'}`,
      `${t.accountIdLabel}: ${activeNumber || result.accountNumber || '—'}`
    ];
    if (result.amount) {
      lines.push(`${t.amountLabel}: ${result.amount} ${result.currency || ''}`);
    }
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentNumber = activeNumber || (result ? result.accountNumber : '');
  const bankTheme = result?.bankName ? BANK_THEMES[result.bankName] : undefined;

  return (
    <div
      id="khqr-result-card"
      className="w-full rounded-2xl bg-[#5c4ef2]/95 sm:bg-[#5848eb] p-5 sm:p-6 text-white shadow-xl shadow-indigo-950/40 border border-indigo-400/30 transition-all"
    >
      {/* Result Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {t.resultTitle}
            </h3>
            <span className="text-[11px] text-white/80 block">
              {result ? t.resultReady : t.resultWaiting}
            </span>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyAllSummary}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
              title={t.copySummary}
            >
              {copiedKey === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200 text-[11px]">{t.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{t.copySummary}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fields List matching user screenshot */}
      <div className="space-y-4">
        {/* 1. លេខគណនី / Account ID */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.accountIdLabel}</span>
            </label>
            {result?.mobileNumber && (
              <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                {t.phoneTag}
              </span>
            )}
          </div>

          <div className="relative group">
            <div className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white/20 border border-white/20 flex items-center justify-between backdrop-blur-xs">
              <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white select-all">
                {currentNumber || '—'}
              </span>
              {currentNumber && currentNumber !== '—' && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentNumber, 'accountNumber')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition shrink-0"
                >
                  {copiedKey === 'accountNumber' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span className="text-emerald-200">{t.copiedDone}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.copy}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Secondary ID selectors if multiple IDs available (e.g. Phone vs Account vs Bakong) */}
          {result?.secondaryNumbers && result.secondaryNumbers.length > 1 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-white/80 block mb-1">
                {t.altIdLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.secondaryNumbers.map((item, idx) => {
                  const isSelected = currentNumber === item.value;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectNumber(item.value)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-mono transition border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                          : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. ឈ្មោះគណនី / Merchant Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.accountNameLabel}</span>
            </label>
          </div>

          <div className="relative group">
            <div className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white/20 border border-white/20 flex items-center justify-between backdrop-blur-xs">
              <span className="font-bold tracking-wide text-sm sm:text-base text-white uppercase select-all truncate">
                {result?.accountName || '—'}
              </span>
              {result?.accountName && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.accountName, 'accountName')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition shrink-0 ml-2"
                >
                  {copiedKey === 'accountName' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span className="text-emerald-200">{t.copiedDone}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.copy}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. ធនាគារ / Bank Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.bankNameLabel}</span>
            </label>
            {bankTheme && (
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded border border-white/20">
                {bankTheme.shortCode}
              </span>
            )}
          </div>

          <div className="relative group">
            <div className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-white/20 border border-white/20 flex items-center justify-between backdrop-blur-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-sm sm:text-base text-white select-all truncate">
                  {result?.bankName || '—'}
                </span>
                {result?.isKhqr && (
                  <span className="text-[10px] bg-red-500/80 text-white font-black px-1.5 py-0.5 rounded tracking-tighter">
                    KHQR
                  </span>
                )}
              </div>
              {result?.bankName && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.bankName, 'bankName')}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition shrink-0 ml-2"
                >
                  {copiedKey === 'bankName' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span className="text-emerald-200">{t.copiedDone}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.copy}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Optional Amount in QR if dynamic */}
        {result?.amount && (
          <div className="pt-1">
            <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-200" />
              <span>{t.amountLabel}</span>
            </label>
            <div className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-between backdrop-blur-xs">
              <span className="font-mono font-extrabold text-base sm:text-lg text-emerald-200">
                {result.currency === 'KHR'
                  ? `${Number(result.amount).toLocaleString()} ៛ (KHR)`
                  : `$${Number(result.amount).toFixed(2)} (USD)`}
              </span>
              <span className="text-[10px] bg-emerald-400/30 text-emerald-100 font-bold px-2 py-0.5 rounded">
                {t.dynamicQr}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer status info */}
      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
        <span>{t.allBanksSupport}</span>
        {result && (
          <span className="font-mono text-[10px] text-white/90 bg-white/10 px-2 py-0.5 rounded">
            {t.emvcoNotice}
          </span>
        )}
      </div>
    </div>
  );
};
