import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { parseKhqrData, KhqrParseResult } from '../utils/khqrParser';
import { useLanguage } from '../context/LanguageContext';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: KhqrParseResult) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanFrame();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(t.cameraError);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (code && code.data) {
        const parsed = parseKhqrData(code.data);
        if (parsed.success) {
          stopCamera();
          onScanSuccess(parsed);
          onClose();
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-purple-500/30 shadow-2xl p-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Camera className="w-4 h-4 text-purple-400" />
            <span>{t.cameraTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFacingMode}
              title={t.cameraSwitch}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport */}
        <div className="relative mt-3 rounded-xl overflow-hidden bg-black aspect-square flex items-center justify-center border border-slate-800">
          {cameraError ? (
            <div className="p-4 text-center text-rose-300 text-xs space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
              <p className="font-semibold">{cameraError}</p>
              <p className="text-[11px] text-slate-400">
                {t.cameraErrorAlt}
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Target Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 rounded-2xl border-2 border-purple-400/80 relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1 rounded-br" />

                  {/* Animated laser scan line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
                <span className="text-[11px] font-semibold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs border border-white/10">
                  {t.cameraBoxGuide}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{t.allBanksSupport}</span>
          <button
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-800"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
