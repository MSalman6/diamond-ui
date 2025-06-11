'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface StakingContextType {
  initialized: boolean;
}

const StakingContext = createContext<StakingContextType | undefined>(undefined);

export const useStaking = () => {
  const context = useContext(StakingContext);
  if (context === undefined) {
    throw new Error('useStaking must be used within a StakingProvider');
  }
  return context;
};

interface StakingProviderProps {
  children: ReactNode;
}

export const StakingProvider: React.FC<StakingProviderProps> = ({ children }) => {
  const value: StakingContextType = {
    initialized: false,
  };

  return (
    <StakingContext.Provider value={value}>
      {children}
    </StakingContext.Provider>
  );
};