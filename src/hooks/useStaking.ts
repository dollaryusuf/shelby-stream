import { useState, useEffect } from 'react';
import { useShelby } from '../context/ShelbyContext';
import { ROIResult } from '../types';

export const useStakingROI = (stakeAmount: number, monthlyReads: number) => {
  const { client } = useShelby();
  const [roi, setRoi] = useState<ROIResult>({ monthlyReturn: 0, annualROI: 0 });

  useEffect(() => {
    const result = client.calculateProjectedROI(stakeAmount, monthlyReads);
    setRoi(result);
  }, [stakeAmount, monthlyReads, client]);

  return roi;
};
