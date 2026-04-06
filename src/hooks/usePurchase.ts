import { useState } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const usePurchase = () => {
  const { connected } = useWallet();
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState<string[]>([]);

  const purchase = async (id: string, callback: () => Promise<void>) => {
    if (!connected) {
      alert("Please connect your Aptos wallet first.");
      return;
    }
    setPurchasing(true);
    try {
      await callback();
      setPurchased(prev => [...prev, id]);
    } catch (err) {
      console.error("Purchase failed:", err);
    } finally {
      setPurchasing(false);
    }
  };

  return { purchasing, purchased, purchase };
};
