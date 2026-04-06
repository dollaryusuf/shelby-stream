import { useState, useEffect } from 'react';
import { useShelby } from '../context/ShelbyContext';
import { NetworkMetrics } from '../types';

export const useNetworkMetrics = () => {
  const { client } = useShelby();
  const [metrics, setMetrics] = useState<NetworkMetrics>({ throughput: 0, health: 0 });
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const m = await client.getNetworkMetrics();
      setMetrics(m);
      
      const l = 10 + Math.random() * 5;
      setLatency(l);
    }, 2000);

    return () => clearInterval(interval);
  }, [client]);

  return { metrics, latency };
};
