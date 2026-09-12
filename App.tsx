import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  History, 
  ShieldCheck, 
  CheckCircle2,
  Languages
} from 'lucide-react';
import { KhqrParseResult } from './utils/khqrParser';
import { QrBankingScanner } from './components/QrBankingScanner';
import { ScanResultCard } from './components/ScanResultCard';
import { CameraScannerModal } from './components/CameraScannerModal';
import { ScanHistoryModal } from './components/ScanHistoryModal';
import { AdBanner } from './components/AdBanner';
import { AdConfigModal } from './components/AdConfigModal';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t, lang, setLang } = useLanguage();
  const [scanResult, setScanResult] = useState<KhqrParseResult | null>(null);
  const [activeNumber, setActiveNumber] = useState<string>('');
  const [history, setHistory] = useState<KhqrParseResult[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdConfigOpen, setIsAdConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khqr_scan_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleScanSuccess = (result: KhqrParseResult) => {
    setScanResult(result);
    setActiveNumber(result.accountNumber || '');
    showToast(t.toastScanSuccess(result.bankName, result.accountName || result.accountNumber));

    // Update scan history (keep maximum 20 latest)
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.accountNumber !== result.accountNumber || item.bankName !== result.bankName
      );
      const updated = [result, ...filtered].slice(0, 20);
      try {
        localStorage.setItem('khqr_scan_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClear = () => {
    setScanResult(null);
    setActiveNumber('');
    showToast(t.toastCleared);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('khqr_scan_history');
    } catch {
      // ignore
    }
    showToast(t.toastHistoryCleared);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4d3bf0] via-[#5241f3] to-[#3a29db] text-slate-100 flex flex-col font-sans selection:bg-purple-300 selection:text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-black/10 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>KHQR Scanner</span>
                <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded tracking-normal">
                  {t.brandTag}
                </span>
              </h1>
              <p className="text-[11px] text-white/80 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-white/10 p-0.5 border border-white/20">
              <button
                onClick={() => setLang('km')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  lang === 'km'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
                title="ប្តូរជាភាសាខ្មែរ"
              >
                <span>🇰🇭</span>
                <span>ខ្មែរ</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Live Camera button */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20 active:scale-95"
              title={t.cameraTitle}
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{t.btnCamera}</span>
            </button>

            {/* History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/20 active:scale-95"
              title={t.historyTitle}
            >
              <History className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{t.btnHistory}</span>
              {history.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center -mr-1">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Main Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-sm">
            {t.pageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto">
            {t.pageSubtitle}
          </p>
        </div>

        {/* 2-Card Layout directly mirroring the user's uploaded image UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Left: Upload QR Banking Card */}
          <QrBankingScanner
            onScanSuccess={handleScanSuccess}
            onClear={handleClear}
            onOpenCamera={() => setIsCameraOpen(true)}
          />

          {/* Right: Account ID & Merchant Result Card */}
          <ScanResultCard
            result={scanResult}
            activeNumber={activeNumber}
            onSelectNumber={(val) => setActiveNumber(val)}
            onClear={handleClear}
          />
        </div>

        {/* Google AdSense / Sponsor Banner */}
        <AdBanner
          slotType="leaderboard"
          onOpenSettings={() => setIsAdConfigOpen(true)}
        />

        {/* Feature & Privacy Assurance */}
        <div className="rounded-2xl bg-black/20 border border-white/10 p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.privacyTitle}</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            {t.privacyDesc}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/70">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">ABA Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">ACLEDA Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Wing Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Canadia Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Sathapana Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">KB Prasac</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Hattha Bank</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Chip Mong</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">{t.moreBanks}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>© {new Date().getFullYear()} KHQR Bank Scanner. {t.footerRights}</p>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-white transition underline underline-offset-2"
            >
              {t.footerScanHistory}
            </button>
            <button
              onClick={() => setIsCameraOpen(true)}
              className="hover:text-white transition underline underline-offset-2"
            >
              {t.footerScanCamera}
            </button>
            <button
              onClick={() => setIsAdConfigOpen(true)}
              className="hover:text-white transition underline underline-offset-2 text-amber-300/80 hover:text-amber-200"
            >
              Google AdSense
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setScanResult(item);
          setActiveNumber(item.accountNumber);
        }}
        onClearHistory={handleClearHistory}
      />

      <AdConfigModal
        isOpen={isAdConfigOpen}
        onClose={() => setIsAdConfigOpen(false)}
      />
    </div>
  );
}
