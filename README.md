# Shelby Stream

Shelby Stream is a decentralized media marketplace and dCDN (decentralized Content Delivery Network) built on the **Shelby Protocol** and the **Aptos Blockchain**. It enables high-performance, low-latency streaming of large-scale media and AI datasets with instant, transparent monetization.

## 🚀 Features

- **Decentralized Fiber Network**: High-speed data delivery using erasure-coded blobs across a global network of storage providers.
- **Pay-Per-Read Gatekeeper**: Content is secured by Aptos smart contracts. Users pay a micro-fee to unlock "Read" bandwidth for specific blobs.
- **AI Dataset Marketplace**: A specialized UI for large-scale data (CSVs, Model Weights) with built-in speed tests to verify network latency before purchase.
- **Creator Staking Dashboard**: Fans can stake APT into a creator's "Storage Fund" to earn a share of the revenue (85/10/5 split).
- **Embeddable Player SDK**: A lightweight widget that can be embedded anywhere, with automatic platform relay fee handling.
- **Global Fiber Map**: Real-time visualization of active storage nodes and network health.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Motion (for animations).
- **Blockchain**: Aptos (Move Smart Contracts), Aptos Wallet Adapter.
- **Storage**: Shelby Protocol (dCDN).
- **Visualization**: React Simple Maps, Lucide Icons.
- **Video**: Video.js with custom Fiber-Link middleware.

## 📦 Project Structure

- `/src/contracts/`: Move smart contracts for the marketplace and revenue splitting.
- `/src/lib/`: Shelby Protocol SDK mocks and Fiber-Link streaming middleware.
- `/src/components/`: Reusable UI components (Player, Uploader, Marketplace, Map).
- `/src/hooks/`: Custom React hooks for streaming and protocol interaction.
- `/src/context/`: Shelby Provider for centralized client management.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📜 Smart Contract (Move)

The marketplace logic is defined in `src/contracts/shelby_stream.move`. It handles:
- Content registration.
- Revenue distribution (85% Creator, 10% Storage Provider, 5% Treasury).
- Access control for "Read" operations.

## 🌐 Fiber-Link Middleware

The core of the streaming logic is in `src/lib/fiberLink.ts`. It translates Shelby `blob_id`s into `MediaSource` streams for standard HTML5 video elements, ensuring zero-lag playback from the decentralized network.

---

© 2026 Shelby Stream. Powered by Shelby Protocol.
