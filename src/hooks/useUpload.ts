import { useState } from 'react';
import { useShelby } from '../context/ShelbyContext';

export const useUpload = () => {
  const { nodeClient } = useShelby();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadBlob = async (file: File, metadata: any) => {
    setUploading(true);
    setProgress(0);
    
    const result = await nodeClient.uploadBlob(file, metadata);
    
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setUploading(false);
    return result;
  };

  return { uploading, progress, uploadBlob };
};
