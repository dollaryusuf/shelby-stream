/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Info,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Zap,
  PlayCircle,
  UploadCloud,
  Database,
  Lock,
  Globe,
  Cpu,
  PieChart
} from 'lucide-react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { VideoUploader } from './components/VideoUploader';
import { ShelbyPlayer } from './components/ShelbyPlayer';
import { DatasetMarketplace } from './components/DatasetMarketplace';
import { EmbedPlayer } from './components/EmbedPlayer';
import { LatencyMonitor } from './components/LatencyMonitor';
import { StakingDashboard } from './components/StakingDashboard';
import { FiberMap } from './components/FiberMap';

export default function App() {
  const [activeTab, setActiveTab] = useState<'consumer' | 'provider' | 'marketplace' | 'staking'>('consumer');
  const { connected, account, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock connection for demo if real adapter isn't available in iframe
  const [mockConnected, setMockConnected] = useState(false);
  const [mockAddress, setMockAddress] = useState('');

  const isWalletConnected = connected || mockConnected;
  const walletAddress = account?.address?.toString() || mockAddress;

  const connectWallet = () => {
    // In a real app, this would open the wallet selector
    // For this demo, we'll simulate a connection
    setMockConnected(true);
    setMockAddress('0x1234...5678');
  };

  const disconnectWallet = () => {
    if (connected) disconnect();
    setMockConnected(false);
    setMockAddress('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Shelby Stream
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setActiveTab('consumer')}
                className={`text-sm font-medium transition-colors ${activeTab === 'consumer' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
              >
                Explore Content
              </button>
              <button 
                onClick={() => setActiveTab('provider')}
                className={`text-sm font-medium transition-colors ${activeTab === 'provider' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
              >
                Provider Dashboard
              </button>
              
              {isWalletConnected ? (
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono">{walletAddress}</span>
                  <button 
                    onClick={disconnectWallet}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <Globe className="w-3 h-3" />
            <span>Decentralized Fiber Network Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Streaming at the <br />
            <span className="text-blue-500">Speed of Fiber</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">
            The world's first dCDN and Media Marketplace built on the Shelby Protocol. 
            High-definition streaming with instant, transparent micropayments on Aptos.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-12 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('consumer')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'consumer' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Watch & Stream
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'marketplace' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Database className="w-4 h-4" />
            AI Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('provider')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'provider' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload & Earn
          </button>
          <button 
            onClick={() => setActiveTab('staking')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'staking' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Stake & ROI
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'consumer' ? (
            <motion.div 
              key="consumer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Player Section */}
              <div className="lg:col-span-2 space-y-8">
                <ShelbyPlayer 
                  blobId="shelby_fiber_demo_4k_001" 
                  poster="https://picsum.photos/seed/fiber/1920/1080"
                  price="0.05 APT"
                />
                
                <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Embeddable Player SDK
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Monetize your content anywhere. Embed the Shelby Stream player with a single line of code.
                    The platform relay fee (1%) is automatically handled on-chain.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-blue-400 overflow-x-auto">
                      {`<iframe src="https://shelby.stream/embed/blob_id" />`}
                    </div>
                    <div className="h-[200px]">
                      <EmbedPlayer 
                        blobId="shelby_fiber_demo_4k_001" 
                        price="0.05 APT"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <LatencyMonitor />
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Network Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Active Nodes</span>
                      <span className="text-white font-mono">1,240</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Avg. Latency</span>
                      <span className="text-green-400 font-mono">12ms</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Erasure Coding</span>
                      <span className="text-white font-mono">10+4</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[98%]" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Security Audited
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Shelby Stream uses built-in erasure coding and periodic auditing checks to ensure 100% data integrity for all stored content.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'marketplace' ? (
            <motion.div 
              key="marketplace"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DatasetMarketplace />
            </motion.div>
          ) : activeTab === 'staking' ? (
            <motion.div 
              key="staking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StakingDashboard />
            </motion.div>
          ) : (
            <motion.div 
              key="provider"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <VideoUploader />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <Database className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-bold text-white">Blob-ify Tech</h4>
                  <p className="text-xs text-slate-500">Large files are split into erasure-coded blobs for distributed storage.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <Cpu className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-bold text-white">AI Dataset Ready</h4>
                  <p className="text-xs text-slate-500">Optimized for high-speed training data delivery to AI models.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <Lock className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-bold text-white">Permissionless</h4>
                  <p className="text-xs text-slate-500">No gatekeepers. Upload and monetize your content instantly.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Fiber Map Section (Visible on Consumer Tab) */}
        {activeTab === 'consumer' && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24"
          >
            <FiberMap />
          </motion.div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-400" />
            </div>
            <span className="font-bold text-slate-400">Shelby Stream</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">SDK</a>
            <a href="#" className="hover:text-white transition-colors">Aptos Explorer</a>
          </div>
          <p className="text-xs text-slate-600">
            © 2026 Shelby Stream. Powered by Shelby Protocol.
          </p>
        </div>
      </footer>
    </div>
  );
}
