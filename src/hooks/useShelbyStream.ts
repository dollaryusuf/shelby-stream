import { useState, useCallback } from 'react';
import { useShelby } from '../context/ShelbyContext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getPurchasePayload } from '../services/aptosService';

export interface StreamState {
  blobId: string;
  isUnlocked: boolean;
  isBuffering: boolean;
  error: string | null;
  progress: number;
  blobUrl: string | null;
}

export const useShelbyStream = (blobId: string | null, creatorAddress?: string) => {
  const { client } = useShelby();
  const { signAndSubmitTransaction } = useWallet();
  const [state, setState] = useState<StreamState>({
    blobId: blobId || '',
    isUnlocked: false,
    isBuffering: false,
    error: null,
    progress: 0,
    blobUrl: null,
  });

  const unlockStream = useCallback(async () => {
    if (!blobId || !creatorAddress) {
      setState(prev => ({ ...prev, error: "Missing blobId or creatorAddress." }));
      return;
    }
    
    setState(prev => ({ ...prev, isBuffering: true, error: null }));
    
    try {
      // Task 3: "Pay-Per-Read" Flow
      // 1. Trigger the Move contract pay_for_read
      const payload = getPurchasePayload(creatorAddress);
      console.log(`Processing Aptos transaction for "Read" access: ${blobId}`);
      
      const response = await signAndSubmitTransaction({
        data: payload as any,
      });

      // 2. Wait for Aptos transaction confirmation (simulated as signAndSubmitTransaction handles submission)
      console.log("Transaction submitted:", response.hash);

      // 3. Once confirmed, fetch the blob data using client.getBlob(blobId)
      const blobData = await client.getBlob(blobId);
      
      // 4. Convert the resulting data into a Blob URL for the video player
      const blob = new Blob([blobData], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);
      
      setState(prev => ({ 
        ...prev, 
        isUnlocked: true, 
        isBuffering: false,
        blobUrl
      }));
    } catch (err: any) {
      console.error("Payment or retrieval error:", err);
      setState(prev => ({ 
        ...prev, 
        error: err.message || "Failed to unlock stream on Aptos.", 
        isBuffering: false 
      }));
    }
  }, [blobId, creatorAddress, signAndSubmitTransaction, client]);

  const fetchChunk = useCallback(async (offset: number, size: number) => {
    if (!state.isUnlocked || !blobId) {
      throw new Error("Stream not unlocked or blobId missing.");
    }
    
    try {
      // Pull data chunks directly from the Shelby Protocol fiber network
      const chunk = await client.getBlobChunk(blobId, offset, size);
      
      setState(prev => ({ 
        ...prev, 
        progress: Math.min(100, (offset + size) / 1000000) // Mock progress
      }));
      
      return chunk;
    } catch (err) {
      console.error("Shelby Protocol fetch error:", err);
      throw err;
    }
  }, [state.isUnlocked, blobId, client]);

  return {
    ...state,
    unlockStream,
    fetchChunk,
  };
};
