import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle, HelpCircle, DollarSign, Globe, ExternalLink, Shield } from 'lucide-react';
import { AdConfig, DEFAULT_AD_CONFIG } from './AdBanner';

interface AdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdConfigModal: React.FC<AdConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AdConfig>(DEFAULT_AD_CONFIG);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khqr_ad_config');
      if (saved) {
        setConfig(JSON.parse(saved));
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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                កំណត់ពាណិជ្ជកម្ម AdSense & Affiliate
              </h3>
              <p className="text-xs text-slate-400">
                រកចំណូលពីគេហទំព័រស្កេន KHQR តាមរយៈ Google Ads & តំណភ្ជាប់ដៃគូ
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
          {/* AdSense Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block text-sm">
                បើកដំណើរការ Google AdSense
              </span>
              <span className="text-slate-400 text-[11px]">
                បង្ហាញផ្ទាំងពាណិជ្ជកម្មពិតប្រាកដរបស់ Google
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
                  Google AdSense Publisher ID (ca-pub-XXXXX):
                </label>
                <input
                  type="text"
                  value={config.publisherId}
                  onChange={(e) => setConfig({ ...config, publisherId: e.target.value.trim() })}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Slot ID - Leaderboard (កំពូល):
                  </label>
                  <input
                    type="text"
                    value={config.slotLeaderboard}
                    onChange={(e) => setConfig({ ...config, slotLeaderboard: e.target.value.trim() })}
                    placeholder="ឧ. 1234567890"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Slot ID - Rectangle (ចំហៀង):
                  </label>
                  <input
                    type="text"
                    value={config.slotRectangle}
                    onChange={(e) => setConfig({ ...config, slotRectangle: e.target.value.trim() })}
                    placeholder="ឧ. 9876543210"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-purple-500 focus:outline-none font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p>
                  ចំណាំ៖ ដើម្បីឲ្យ AdSense បង្ហាញ សូមប្រាកដថាគេហទំព័ររបស់អ្នកត្រូវបាន Approved ដោយ Google AdSense ហើយដាក់កូដ script ចូលក្នុង Header ។
                </p>
              </div>
            </div>
          )}

          {/* Affiliate links info */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
              <Globe className="w-4 h-4" />
              <span>ដៃគូពាណិជ្ជកម្ម & Affiliate (Partnership)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              នៅពេល AdSense មិនទាន់បានបើក ប្រព័ន្ធនឹងបង្ហាញផ្ទាំងផ្សព្វផ្សាយដៃគូ (Affiliate Cards) ដូចជា ជើងទម្រស្កេន KHQR, ម៉ាស៊ីន POS, និងសេវាកម្មធនាគារ ដោយស្វ័យប្រវត្តិ។
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>ជួយបង្កើនប្រាក់ចំណូលតាមរយៈ Commission ពីការចុច និងទិញទំនិញ</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-900/40"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>បានរក្សាទុក!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>រក្សាទុកការកំណត់</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
