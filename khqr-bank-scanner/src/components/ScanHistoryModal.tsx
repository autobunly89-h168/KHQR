import React from 'react';
import { History, Trash2, Copy, Check, X } from 'lucide-react';
import { KhqrParseResult } from '../utils/khqrParser';
import { useLanguage } from '../context/LanguageContext';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: KhqrParseResult[];
  onSelect: (item: KhqrParseResult) => void;
  onClearHistory: () => void;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClearHistory
}) => {
  const { t } = useLanguage();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.historyTitle}</h3>
              <p className="text-xs text-slate-400">{t.historyCount(history.length)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="my-3 overflow-y-auto flex-1 space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{t.historyEmpty}</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.bankName}
                    </span>
                    {item.amount && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        ${item.amount} {item.currency || ''}
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">
                    {item.accountName || t.noName}
                  </h5>
                  <span className="font-mono text-xs font-semibold text-amber-300">
                    {item.accountNumber}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(item.accountNumber, idx, e)}
                    className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title={t.copyAccount}
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 py-1.5 px-2.5 rounded-lg hover:bg-rose-500/10 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.historyClearAll}</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
