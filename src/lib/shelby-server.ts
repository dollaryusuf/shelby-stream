import { ShelbyNodeClient } from './shelby.ts';
import { SHELBY_CONFIG } from '../constants.ts';

// Initialize Shelby Node Client for server-side operations
// This client uses the SHELBY_API_KEY which must be kept secret
export const getShelbyNode = () => {
  const apiKey = process.env.SHELBY_API_KEY;
  
  if (!apiKey) {
    console.warn('SHELBY_API_KEY is not set. Using demo key.');
  }

  return new ShelbyNodeClient({
    apiKey: apiKey || "SHELBY_PROVIDER_KEY_DEMO",
    erasureK: SHELBY_CONFIG.ERASURE_CODING_K,
    erasureM: SHELBY_CONFIG.ERASURE_CODING_M,
  });
};
