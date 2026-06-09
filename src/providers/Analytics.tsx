import React, { ReactNode, useMemo } from 'react';
import { AnalyticsConfig, AnalyticsContext } from './AnalyticsContext';

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
