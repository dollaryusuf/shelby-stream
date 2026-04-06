import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet, ShieldCheck, Loader2, Info, ArrowUpRight, Lock, Users, PieChart } from 'lucide-react';
import { useShelby } from '../context/ShelbyContext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useStakingROI } from '../hooks/useStaking';
import { motion, AnimatePresence } from 'motion/react';

export const StakingDashboard: React.FC = () => {
  const { client } = useShelby();
  const { connected } = useWallet();
  const [stakeAmount, setStakeAmount] = useState<number>(100);
  const [monthlyReads, setMonthlyReads] = useState<number>(50000);
  const roi = useStakingROI(stakeAmount, monthlyReads);
  const [isStaking, setIsStaking] = useState(false);
  const [staked, setStaked] = useState(0);

  const handleStake = async () => {
    if (!connected) {
      alert("Please connect your Aptos wallet first.");
      return;
    }
    setIsStaking(true);
    // Simulate Aptos transaction
    await new Promise(r => setTimeout(r, 2000));
    setStaked(prev => prev + stakeAmount);
    setIsStaking(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Staking Controls */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Wallet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Creator Storage Fund</h3>
              <p className="text-slate-500 text-sm">Stake APT to provide storage bandwidth and earn a share of revenue.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stake Amount (APT)</label>
                <span className="text-white font-mono font-bold">{stakeAmount} APT</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="5000" 
                step="10"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projected Monthly "Reads"</label>
                <span className="text-white font-mono font-bold">{monthlyReads.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="500000" 
                step="1000"
                value={monthlyReads}
                onChange={(e) => setMonthlyReads(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <button 
              onClick={handleStake}
              disabled={isStaking}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-500/10"
            >
              {isStaking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Stake {stakeAmount} APT into Fund
            </button>
          </div>
        </div>

        {/* ROI Calculator Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h4 className="text-sm font-bold text-white">Projected Monthly Return</h4>
            </div>
            <p className="text-3xl font-mono font-bold text-white">{roi.monthlyReturn.toFixed(4)} <span className="text-sm text-slate-500">APT</span></p>
            <p className="text-xs text-slate-500 mt-2">Based on 5% staker revenue share.</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <PieChart className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="text-sm font-bold text-white">Estimated Annual ROI</h4>
            </div>
            <p className="text-3xl font-mono font-bold text-purple-400">{roi.annualROI.toFixed(1)}%</p>
            <p className="text-xs text-slate-500 mt-2">Variable based on network demand.</p>
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2 text-white">
            <Users className="w-4 h-4 text-blue-500" />
            Your Staking Portfolio
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Total Staked</span>
              <span className="text-white font-mono font-bold">{staked} APT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Active Funds</span>
              <span className="text-white font-mono font-bold">{staked > 0 ? 1 : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Accrued Rewards</span>
              <span className="text-green-400 font-mono font-bold">0.0000 APT</span>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <button className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all">
                Claim Rewards
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">Storage Insurance</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Staked funds are used to pay for erasure coding redundancy. If a node fails, the fund ensures the content remains available via other nodes.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
            <Info className="w-3 h-3" />
            <span>Learn about Slashing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
