import { ShelbyClient, ShelbyNodeClient } from '../lib/shelby';
import { SHELBY_CONFIG } from '../constants';

export const createShelbyClient = () => {
  return new ShelbyClient({
    aptosNodeUrl: SHELBY_CONFIG.TESTNET_URL,
    latencyPriority: SHELBY_CONFIG.FIBER_LATENCY_PRIORITY,
  });
};

export const createShelbyNodeClient = () => {
  return new ShelbyNodeClient({
    apiKey: "SHELBY_PROVIDER_KEY_DEMO",
    erasureK: SHELBY_CONFIG.ERASURE_CODING_K,
    erasureM: SHELBY_CONFIG.ERASURE_CODING_M,
  });
};
