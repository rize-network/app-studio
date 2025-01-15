// analytics/AnalyticsContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';

export type AnalyticsConfig = {
  trackEvent?: (event: any) => void;
};

// Create the context with a default no-op implementation
export const AnalyticsContext = createContext<AnalyticsConfig>({});

export const useAnalytics = (): AnalyticsConfig => useContext(AnalyticsContext);

export const AnalyticsProvider = ({
  trackEvent,
  children,
}: AnalyticsConfig & {
  children?: ReactNode;
}): React.ReactElement => {
  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
