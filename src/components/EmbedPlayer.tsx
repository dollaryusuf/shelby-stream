import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useShelbyStream } from '../hooks/useShelbyStream';
import { attachFiberToVideo } from '../lib/fiberLink';
import { Play, Lock, Loader2, ShieldCheck, Zap, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmbedPlayerProps {
  blobId: string;
  poster?: string;
  price?: string;
  isEmbedded?: boolean;
}

export const EmbedPlayer: React.FC<EmbedPlayerProps> = ({ 
  blobId, 
  poster = "https://picsum.photos/seed/shelby/1280/720?blur=4",
  price = "0.05 APT",
  isEmbedded = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const { isUnlocked, isBuffering, error, unlockStream } = useShelbyStream(blobId);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !isUnlocked) return;

    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
    });

    playerRef.current = player;
    const detach = attachFiberToVideo(videoRef.current, blobId);

    return () => {
      detach();
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isUnlocked, blobId]);

  const handleUnlock = async () => {
    // In a real embed, we'd trigger the wallet adapter
    // For this demo, we'll simulate the 85/10/5 revenue split
    console.log(`Embed: Unlocking ${blobId} with Revenue Split: 85% Creator, 10% Storage Provider, 5% Platform Treasury`);
    await unlockStream();
    setShowOverlay(false);
  };

  return (
    <div className={`relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${isEmbedded ? 'w-full h-full' : ''}`}>
      {/* Video Element */}
      <div data-vjs-player>
        <video 
          ref={videoRef} 
          className="video-js vjs-big-play-centered vjs-theme-city"
          poster={poster}
        />
      </div>

      {/* Lock Overlay */}
      <AnimatePresence>
        {!isUnlocked && showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="mb-4 p-3 bg-blue-500/10 rounded-full relative">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">Stream Locked</h3>
            <p className="text-slate-500 text-[10px] max-w-[200px] mb-4">
              Unlock this 4K stream on the Shelby fiber network.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 w-full max-w-[180px]">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-bold uppercase tracking-widest">Fee</span>
                <span className="text-blue-400 font-mono font-bold">{price}</span>
              </div>
            </div>

            <button 
              onClick={handleUnlock}
              disabled={isBuffering}
              className={`px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                isBuffering 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-950 hover:bg-slate-200 shadow-xl shadow-white/5 active:scale-95'
              }`}
            >
              {isBuffering ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
              Unlock & Stream
            </button>
            
            <div className="mt-4 flex items-center gap-2 text-[8px] text-slate-600 uppercase tracking-widest">
              <ShieldCheck className="w-2 h-2" />
              <span>Shelby Protocol</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buffering Indicator */}
      {isBuffering && isUnlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Player Info Bar (Visible on Hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-[8px] text-slate-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-2 h-2 text-green-500" /> 120 Mbps
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-2 h-2 text-blue-500" /> Audited
            </span>
            <span className="font-mono text-blue-400">Blob: {blobId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
