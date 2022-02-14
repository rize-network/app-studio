import { useState } from 'react';
import {
  useResponsiveContext,
  ScreenOrientation,
} from '../providers/Responsive';

import { useMount } from './useMount';

export const createQuery = (keyScreen: string, query: string, set: any) => {
  const mql = window.matchMedia(query);
  const onChange = () => {
    if (!!mql.matches) {
      set(keyScreen);
    }
  };

  mql.addListener(onChange);
  if (!!mql.matches) {
    set(keyScreen);
  }

  return () => {
    mql.removeListener(onChange);
  };
};

export const useResponsive = () => {
  const { breakpoints, devices, mediaQueries } = useResponsiveContext();
  const [screen, setScreen] = useState('xs');
  const [orientation, setOrientation] = useState(
    'landscape' as ScreenOrientation
  );

  useMount(() => {
    for (const screenSize in mediaQueries) {
      createQuery(screenSize, mediaQueries[screenSize], setScreen);
    }
    createQuery(
      'landscape',
      'only screen and (orientation: landscape)',
      setOrientation
    );
    createQuery(
      'portrait',
      'only screen and (orientation: portrait)',
      setOrientation
    );
  });

  const on = (device: keyof typeof devices) => {
    return devices[device].includes(screen);
  };

  const is = (s: keyof typeof breakpoints) => {
    return s == screen;
  };

  return {
    breakpoints,
    devices,
    orientation,
    screen,
    on,
    is,
  };
};
