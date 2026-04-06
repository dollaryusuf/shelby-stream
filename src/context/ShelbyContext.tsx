import React, { createContext, useContext, useMemo } from 'react';
import { ShelbyNodeClient, ShelbyClient, shelbyConfig } from '../lib/shelby';

interface ShelbyContextType {
  nodeClient: ShelbyNodeClient;
  client: ShelbyClient;
}

const ShelbyContext = createContext<ShelbyContextType | null>(null);

export const ShelbyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nodeClient = useMemo(() => new ShelbyNodeClient(shelbyConfig), []);
  const client = useMemo(() => new ShelbyClient(shelbyConfig), []);

  return (
    <ShelbyContext.Provider value={{ nodeClient, client }}>
      {children}
    </ShelbyContext.Provider>
  );
};

export const useShelby = () => {
  const context = useContext(ShelbyContext);
  if (!context) {
    throw new Error('useShelby must be used within a ShelbyProvider');
  }
  return context;
};
