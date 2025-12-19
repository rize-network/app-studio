import { useResponsiveContext } from '../providers/Responsive';

export const useResponsive = () => {
  const context = useResponsiveContext();
  const { currentBreakpoint: screen, orientation, devices } = context;
  const on = (s: string) =>
    devices[s] ? devices[s].includes(screen) : s === screen;
  const result = { ...context, screen, orientation, on, is: on };
  // console.log('[useResponsive] Hook called, returning:', { screen, orientation, 'on(mobile)': on('mobile') });
  return result;
};
