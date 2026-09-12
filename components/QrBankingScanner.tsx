import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Trash2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { decodeQrFromImageSrc, KhqrParseResult } from '../utils/khqrParser';
import { useLanguage } from '../context/LanguageContext';

interface QrBankingScannerProps {
  onScanSuccess: (result: KhqrParseResult) => void;
  onClear: () => void;
  onOpenCamera: () => void;
  className?: string;
}

export const QrBankingScanner: React.FC<QrBankingScannerProps> = ({
  onScanSuccess,
  onClear,
  onOpenCamera,
  className = ''
}) => {
  const { t, lang } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage(t.errorImageFile);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
    await processImageSrc(objectUrl);
  };

  const processImageSrc = async (src: string) => {
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const result = await decodeQrFromImageSrc(src);
      if (result.success) {
        onScanSuccess(result);
      } else {
        setErrorMessage(result.error || t.errorScanFailed);
      }
    } catch (err) {
      setErrorMessage(lang === 'km' ? `មានបញ្ហាក្នុងការស្កេនរូបភាព QR: ${String(err)}` : `Error scanning QR image: ${String(err)}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  // Handle Clipboard Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            return;
          }
        }
      }

      const text = e.clipboardData.getData('text');
      if (text && (text.startsWith('data:image/') || text.startsWith('http'))) {
        e.preventDefault();
        setImageSrc(text);
        processImageSrc(text);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleClear = () => {
    setImageSrc(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div
      id="upload-qr-banking-card"
      className={`w-full rounded-2xl bg-[#5c4ef2]/95 sm:bg-[#5848eb] p-5 sm:p-6 text-white shadow-xl shadow-indigo-950/40 border border-indigo-400/30 transition-all ${className}`}
    >
      {/* Title matching user's image */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              {t.uploadTitle}
            </h3>
            <span className="text-[11px] text-white/80 block">
              {t.uploadSubtitle}
            </span>
          </div>
        </div>

        {/* Live Camera scanner shortcut */}
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition active:scale-95 shadow-xs"
          title={t.cameraTitle}
        >
          <Camera className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">{t.btnCamera}</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processImageFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Main Upload Drop Area matching the dashed border in image.png */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center min-h-[190px] sm:min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all p-4 ${
          isDragOver
            ? 'border-emerald-300 bg-white/30 scale-[1.01]'
            : imageSrc
            ? 'border-white/40 bg-black/20 hover:border-white/60'
            : 'border-white/50 bg-white/15 hover:bg-white/20 hover:border-white'
        }`}
      >
        {imageSrc ? (
          <div className="relative w-full h-44 flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Uploaded KHQR"
              className="max-h-full max-w-full object-contain rounded-xl shadow-lg bg-white p-1"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-bold backdrop-blur-xs">
              {t.changeQrImage}
            </div>
          </div>
        ) : (
          <div className="text-center px-4 py-2">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center text-white shadow-inner">
              <ImageIcon className="w-6 h-6" />
            </div>
            {/* The text from image.png */}
            <p className="text-sm sm:text-base font-bold text-white tracking-wide">
              {t.dropzoneLine1}
            </p>
            <p className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
              {t.dropzoneLine2}
            </p>
            <p className="text-[11px] text-white/80 mt-2">
              {t.dropzoneHint} <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-white font-mono text-[10px]">Ctrl + V</kbd>
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {isScanning && (
          <div className="absolute inset-0 rounded-2xl bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-emerald-300">
              {t.scanning}
            </span>
          </div>
        )}
      </div>

      {/* Error message notification if scan failed */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/30 border border-rose-400/50 text-xs text-rose-100 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">{errorMessage}</span>
            <span className="text-[11px] text-rose-200">
              {t.errorScanNotice}
            </span>
          </div>
        </div>
      )}

      {/* Red/Coral Clear Button matching the exact appearance in image.png */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#ff4d4d] to-[#f43f5e] hover:from-[#e03a3a] hover:to-[#e11d48] active:scale-[0.99] transition shadow-lg shadow-rose-950/30 border border-rose-400/40 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.clearBtn}</span>
        </button>
      </div>
    </div>
  );
};
