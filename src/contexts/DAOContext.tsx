'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface DAOContextType {
}

const DAOContext = createContext<DAOContextType | undefined>(undefined);

export const useDAO = () => {
  const context = useContext(DAOContext);
  if (context === undefined) {
    throw new Error('useDAO must be used within a DAOProvider');
  }
  return context;
};

interface DAOProviderProps {
  children: ReactNode;
}

export const DAOProvider: React.FC<DAOProviderProps> = ({ children }) => {
  const value: DAOContextType = {
  };

  return (
    <DAOContext.Provider value={value}>
      {children}
    </DAOContext.Provider>
  );
};