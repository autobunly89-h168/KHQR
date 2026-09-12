import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle, HelpCircle, DollarSign, Globe, Shield, Check } from 'lucide-react';
import { AdConfig, DEFAULT_AD_CONFIG } from './AdBanner';
import { useLanguage } from '../context/LanguageContext';

interface AdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdConfigModal: React.FC<AdConfigModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [config, setConfig] = useState<AdConfig>(DEFAULT_AD_CONFIG);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khqr_ad_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.publisherId) {
          parsed.publisherId = DEFAULT_AD_CONFIG.publisherId;
        }
        setConfig(parsed);
      } else {
        setConfig(DEFAULT_AD_CONFIG);
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('khqr_ad_config', JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      window.location.reload();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'km' ? 'កំណត់ពាណិជ្ជកម្ម Google AdSense' : 'Google AdSense Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'km'
                  ? 'គ្រប់គ្រងកូដ AdSense Publisher ID និង Ad Slots'
                  : 'Manage AdSense Publisher ID and Ad Slots'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          {/* Status info */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">
              {lang === 'km'
                ? 'កូដស្គ្រីប Google AdSense (ca-pub-2027566119468197) ត្រូវបានបញ្ចូលក្នុងគេហទំព័ររួចរាល់'
                : 'Google AdSense script (ca-pub-2027566119468197) is connected in site header'}
            </span>
          </div>

          {/* AdSense Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block text-sm">
                {lang === 'km' ? 'បើកដំណើរការ Google AdSense' : 'Enable Google AdSense'}
              </span>
              <span className="text-slate-400 text-[11px]">
                {lang === 'km'
                  ? 'បង្ហាញផ្ទាំងពាណិជ្ជកម្មពិតប្រាកដរបស់ Google'
                  : 'Display real Google Ads on page'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.adsenseEnabled}
                onChange={(e) => setConfig({ ...config, adsenseEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* AdSense Details */}
          {config.adsenseEnabled && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  {lang === 'km' ? 'Google AdSense Publisher ID:' : 'Google AdSense Publisher ID:'}
                </label>
                <input
                  type="text"
                  value={config.publisherId}
                  onChange={(e) => setConfig({ ...config, publisherId: e.target.value.trim() })}
                  placeholder="ca-pub-2027566119468197"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    {lang === 'km' ? 'Slot ID - Leaderboard (ជួរលើ/ក្រោម):' : 'Slot ID - Leaderboard:'}
                  </label>
                  <input
                    type="text"
                    value={config.slotLeaderboard}
                    onChange={(e) => setConfig({ ...config, slotLeaderboard: e.target.value.trim() })}
                    placeholder={lang === 'km' ? 'ឧ. 1234567890 (ទុកទទេបើ Auto)' : 'e.g. 1234567890 (or blank)'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    {lang === 'km' ? 'Slot ID - Infeed / Sidebar:' : 'Slot ID - Infeed:'}
                  </label>
                  <input
                    type="text"
                    value={config.slotRectangle}
                    onChange={(e) => setConfig({ ...config, slotRectangle: e.target.value.trim() })}
                    placeholder={lang === 'km' ? 'ឧ. 9876543210 (ទុកទទេបើ Auto)' : 'e.g. 9876543210'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p>
                  {lang === 'km'
                    ? 'ចំណាំ៖ ប្រសិនបើអ្នកមិនទាន់បង្កើត Ad Slot ID ជាក់លាក់ទេ Google AdSense នឹងប្រើប្រាស់មុខងារ Auto Ads & Responsive Ads ដោយស្វ័យប្រវត្តិតាមរយៈ Publisher ID របស់អ្នក។'
                    : 'Note: If you haven\'t created a specific Ad Slot ID yet, Google AdSense will use Auto Ads and Responsive display units via your Publisher ID.'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              {lang === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-900/40"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>{lang === 'km' ? 'បានរក្សាទុក!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{lang === 'km' ? 'រក្សាទុកការកំណត់' : 'Save Settings'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
