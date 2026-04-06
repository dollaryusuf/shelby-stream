import { useState } from 'react';
import { useShelby } from '../context/ShelbyContext';
import { NodeLatency } from '../types';

export const useSpeedTest = () => {
  const { client } = useShelby();
  const [latency, setLatency] = useState<NodeLatency[] | null>(null);
  const [testingSpeed, setTestingSpeed] = useState(false);

  const runSpeedTest = async () => {
    setTestingSpeed(true);
    const results = await client.pingNearestNodes();
    setLatency(results);
    setTestingSpeed(false);
  };

  return { latency, testingSpeed, runSpeedTest };
};
