import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useShelbyStream } from '../hooks/useShelbyStream';
import { attachFiberToVideo } from '../lib/fiberLink';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Play, Lock, Loader2, ShieldCheck, Zap, TrendingUp, Info, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShelbyPlayerProps {
  blobId: string;
  poster?: string;
  price?: string;
}

export const ShelbyPlayer: React.FC<ShelbyPlayerProps> = ({ 
  blobId, 
  poster = "https://picsum.photos/seed/shelby/1280/720?blur=4",
  price = "0.05 APT" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const { connected, signAndSubmitTransaction } = useWallet();
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
    if (!connected) {
      alert("Please connect your Aptos wallet first.");
      return;
    }

    try {
      // In a real app, we'd call signAndSubmitTransaction with the Move function
      // For this demo, we'll simulate the transaction confirmation
      console.log(`Gatekeeper: Triggering Read-Grant transaction for ${blobId}...`);
      console.log(`Revenue Split: 85% Creator, 10% Storage Provider, 5% Platform Treasury`);
      
      // const payload = {
      //   type: "entry_function_payload",
      //   function: "0x1::shelby_stream::purchase_read_access",
      //   arguments: [creatorAddress],
      //   type_arguments: [],
      // };
      // await signAndSubmitTransaction(payload);

      await unlockStream();
      setShowOverlay(false);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Video Element */}
      <div data-vjs-player>
        <video 
          ref={videoRef} 
          className="video-js vjs-big-play-centered vjs-theme-city"
          poster={poster}
        />
      </div>

      {/* Lock Overlay (Paid-Read Logic) */}
      <AnimatePresence>
        {!isUnlocked && showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="mb-6 p-4 bg-blue-500/10 rounded-full relative">
              <Lock className="w-12 h-12 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Premium Content Locked</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-8">
              This 4K stream is hosted on the Shelby fiber network. 
              Unlock access for a one-time micro-payment.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 text-xs font-bold uppercase">Streaming Fee</span>
                <span className="text-blue-400 font-mono font-bold">{price}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Quality</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> 4K Ultra HD
                </span>
              </div>
            </div>

            <button 
              onClick={handleUnlock}
              disabled={isBuffering}
              className={`group relative px-12 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-3 ${
                isBuffering 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-white text-slate-950 hover:bg-slate-200 shadow-xl shadow-white/5 active:scale-95'
              }`}
            >
              {isBuffering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing on Aptos...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Unlock & Stream Now
                </>
              )}
            </button>
            
            <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Secured by Shelby Protocol
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buffering Indicator */}
      {isBuffering && isUnlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-white font-bold text-sm tracking-widest uppercase">Pulling Chunks from Fiber...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-30 bg-red-500/90 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Info className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Player Info Bar (Visible on Hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Shelby Stream: Fast-Fiber Mode</h4>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" /> 120 Mbps
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-500" /> Audited
              </span>
              <span className="font-mono text-blue-400">Blob: {blobId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
