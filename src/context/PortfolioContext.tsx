import { createContext, useContext, type ReactNode } from 'react';
import type { PortfolioData } from '@/types/portfolio';
import portfolioData from '@/data/portfolio.json';

const PortfolioContext = createContext<PortfolioData | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  return (
    <PortfolioContext.Provider value={portfolioData as PortfolioData}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
