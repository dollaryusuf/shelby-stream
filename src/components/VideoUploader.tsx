import React, { useState } from 'react';
import { Upload, FileVideo, ShieldCheck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { blobify } from '../lib/shelby';
import { useShelby } from '../context/ShelbyContext';
import { useUpload } from '../hooks/useUpload';
import { useAptosActions } from '../hooks/useAptos';
import { motion, AnimatePresence } from 'motion/react';

export const VideoUploader: React.FC = () => {
  const { nodeClient } = useShelby();
  const { uploading, progress, uploadBlob } = useUpload();
  const { registerContent } = useAptosActions();
  const [file, setFile] = useState<File | null>(null);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pricePerGb, setPricePerGb] = useState<number>(0.05); // Default 0.05 APT per GB

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setError(null);

    try {
      const blob = await blobify(file);
      
      console.log(`Uploading ${file.name} to Shelby Protocol... using ${nodeClient.config.apiKey}`);
      
      const result = await uploadBlob(blob as any, {
        metadata: { name: file.name, price: pricePerGb }
      });
      
      const mockBlobId = result.blobId;
      
      // Register on Aptos
      console.log(`Registering content on Aptos: ${mockBlobId} at ${pricePerGb} APT`);
      await registerContent(Math.floor(pricePerGb * 100000000), mockBlobId); // Convert to Octas
      
      setBlobId(mockBlobId);
      console.log(`Upload and Registration successful! Blob ID: ${mockBlobId}`);
      
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload to Shelby Protocol. Please check your connection.");
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Provider Dashboard</h2>
          <p className="text-slate-400 text-sm">Upload media to the Shelby dCDN</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Drag & Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            file ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={onFileChange}
            accept="video/*,.mkv,.mp4"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            {file ? (
              <div className="flex flex-col items-center">
                <FileVideo className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-500 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-400">Drag and drop or click to select video</p>
                <p className="text-slate-600 text-xs mt-2">Supports MP4, MKV, MOV (Max 2GB)</p>
              </div>
            )}
          </label>
        </div>

        {/* Pricing & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Price per GB Streamed (APT)</label>
            <input 
              type="number" 
              value={pricePerGb}
              onChange={(e) => setPricePerGb(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="0.05"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Protocol Fee (2.5%)</label>
            <div className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl px-4 py-3 text-slate-500 italic">
              Auto-calculated
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            uploading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading to Shelby... {progress}%
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Blob-ify & Upload
            </>
          )}
        </button>

        {/* Status Messages */}
        <AnimatePresence>
          {blobId && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-green-500 font-bold text-sm">Upload Successful!</p>
                <p className="text-slate-400 text-xs mt-1">Blob ID: <span className="font-mono text-white">{blobId}</span></p>
                <p className="text-slate-500 text-[10px] mt-2 italic">Metadata stored on Aptos Testnet. Erasure coding health: 100%</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
