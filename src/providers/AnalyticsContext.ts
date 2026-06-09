import { createContext, useContext } from 'react';

export type AnalyticsConfig = {
  trackEvent?: (event: any) => void;
};

// Create the context with a default no-op implementation
export const AnalyticsContext = createContext<AnalyticsConfig>({});

export const useAnalytics = (): AnalyticsConfig => useContext(AnalyticsContext);
