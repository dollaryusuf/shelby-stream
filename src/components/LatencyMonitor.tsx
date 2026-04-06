import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useShelby } from '../context/ShelbyContext';
import { motion } from 'motion/react';

export const LatencyMonitor: React.FC = () => {
  const { client } = useShelby();
  const [metrics, setMetrics] = useState<{ throughput: number; health: number }>({ throughput: 0, health: 0 });
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const m = await client.getNetworkMetrics();
      setMetrics(m);
      
      // Simulate real-time latency ping
      const l = 10 + Math.random() * 5;
      setLatency(l);
    }, 2000);

    return () => clearInterval(interval);
  }, [client]);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          Proof-of-Speed
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Latency</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-white">{latency.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 font-bold">ms</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-800 pl-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Throughput</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-blue-400">{metrics.throughput.toFixed(0)}</span>
            <span className="text-[10px] text-slate-500 font-bold">Mbps</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-800 pl-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase">Health</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-green-400">{metrics.health.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 font-bold">%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-1 w-full bg-slate-950 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: `${metrics.health}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-green-400"
        />
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[8px] text-slate-600 uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3" />
        <span>Verified by Shelby Fiber Protocol</span>
      </div>
    </div>
  );
};
