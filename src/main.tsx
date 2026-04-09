import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';
import { ShelbyProvider } from './context/ShelbyContext';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AptosWalletAdapterProvider autoConnect={true}>
      <ShelbyProvider>
        <App />
      </ShelbyProvider>
    </AptosWalletAdapterProvider>
  </StrictMode>,
);
