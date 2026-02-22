// analytics/AnalyticsContext.tsx
import React, { createContext, ReactNode, useContext, useMemo } from 'react';

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
  const value = useMemo(() => ({ trackEvent }), [trackEvent]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
