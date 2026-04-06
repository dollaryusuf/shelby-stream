import React, { useState } from 'react';
import { Database, Download, Zap, ShieldCheck, Loader2, Info, TrendingUp, Cpu, Lock } from 'lucide-react';
import { useShelby } from '../context/ShelbyContext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useSpeedTest } from '../hooks/useSpeedTest';
import { useAptosActions } from '../hooks/useAptos';
import { usePurchase } from '../hooks/usePurchase';
import { motion, AnimatePresence } from 'motion/react';

interface Dataset {
  id: string;
  name: string;
  type: 'CSV' | 'Model Weights' | 'Image Set';
  size: string;
  price: string;
  description: string;
}

const mockDatasets: Dataset[] = [
  {
    id: 'shelby_data_001',
    name: 'Global Climate Patterns 2025',
    type: 'CSV',
    size: '1.2 TB',
    price: '2.5 APT',
    description: 'High-resolution climate data collected from 12,000 sensors globally.'
  },
  {
    id: 'shelby_data_002',
    name: 'Llama-4-FineTune-Medical',
    type: 'Model Weights',
    size: '450 GB',
    price: '15.0 APT',
    description: 'Specialized fine-tuned weights for medical diagnosis and research.'
  },
  {
    id: 'shelby_data_003',
    name: 'Autonomous Driving Vision Set',
    type: 'Image Set',
    size: '8.4 TB',
    price: '45.0 APT',
    description: '8 million labeled images for training autonomous vehicle vision systems.'
  }
];

export const DatasetMarketplace: React.FC = () => {
  const { client } = useShelby();
  const { connected } = useWallet();
  const { latency, testingSpeed, runSpeedTest } = useSpeedTest();
  const { purchaseReadAccess } = useAptosActions();
  const { purchasing, purchased, purchase } = usePurchase();

  const handlePurchase = async (datasetId: string) => {
    await purchase(datasetId, async () => {
      // In a real app, we'd get the creator address from metadata
      const mockCreatorAddress = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      await purchaseReadAccess(mockCreatorAddress);
    });
  };

  return (
    <div className="space-y-8">
      {/* Speed Test Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Shelby Fiber Speed Test</h3>
            <p className="text-slate-500 text-xs">Verify network latency before buying large datasets.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {latency && (
            <div className="flex gap-4">
              {latency.map((node, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{node.node.split('-')[2]}</p>
                  <p className={`text-sm font-mono font-bold ${node.latency < 20 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {node.latency}ms
                  </p>
                </div>
              ))}
            </div>
          )}
          <button 
            onClick={runSpeedTest}
            disabled={testingSpeed}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {testingSpeed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {latency ? 'Retest' : 'Run Speed Test'}
          </button>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                {dataset.type === 'CSV' ? <Database className="w-6 h-6 text-blue-500" /> : <Cpu className="w-6 h-6 text-purple-500" />}
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-lg uppercase">
                {dataset.type}
              </span>
            </div>
            
            <h4 className="text-white font-bold text-lg mb-2">{dataset.name}</h4>
            <p className="text-slate-500 text-xs mb-6 line-clamp-2">{dataset.description}</p>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Size</p>
                <p className="text-white font-mono text-sm">{dataset.size}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Price</p>
                <p className="text-blue-400 font-mono text-sm font-bold">{dataset.price}</p>
              </div>
            </div>

            {purchased.includes(dataset.id) ? (
              <button 
                className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download from Fiber
              </button>
            ) : (
              <button 
                onClick={() => handlePurchase(dataset.id)}
                disabled={purchasing}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {purchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Unlock Dataset
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-8 py-8 opacity-50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Erasure Coded (10+4)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Zap className="w-4 h-4" />
          <span>Fiber Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4" />
          <span>Immutable Storage</span>
        </div>
      </div>
    </div>
  );
};
