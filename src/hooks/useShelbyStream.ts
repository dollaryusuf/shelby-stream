import { useState, useCallback } from 'react';
import { useShelby } from '../context/ShelbyContext';

export interface StreamState {
  blobId: string;
  isUnlocked: boolean;
  isBuffering: boolean;
  error: string | null;
  progress: number;
}

export const useShelbyStream = (blobId: string | null) => {
  const { client } = useShelby();
  const [state, setState] = useState<StreamState>({
    blobId: blobId || '',
    isUnlocked: false,
    isBuffering: false,
    error: null,
    progress: 0,
  });

  const unlockStream = useCallback(async () => {
    if (!blobId) return;
    
    setState(prev => ({ ...prev, isBuffering: true }));
    
    try {
      // Simulate Aptos micro-transaction for "Read" bandwidth
      console.log(`Unlocking stream for blob: ${blobId} on Aptos...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate tx time
      
      setState(prev => ({ 
        ...prev, 
        isUnlocked: true, 
        isBuffering: false 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: "Failed to unlock stream on Aptos.", 
        isBuffering: false 
      }));
    }
  }, [blobId]);

  const fetchChunk = useCallback(async (offset: number, size: number) => {
    if (!state.isUnlocked || !blobId) {
      throw new Error("Stream not unlocked or blobId missing.");
    }
    
    try {
      // Pull data chunks directly from the Shelby Protocol fiber network
      // This is a simplified representation of the SDK's chunking logic
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
  }, [state.isUnlocked, blobId]);

  return {
    ...state,
    unlockStream,
    fetchChunk,
  };
};
