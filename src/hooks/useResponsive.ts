import { useState } from 'react';
import {
  useResponsiveContext,
  ScreenOrientation,
  ScreenSizeRange,
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
  const { breakpoints, devices } = useResponsiveContext();
  const [screen, setScreen] = useState('xs');
  const [orientation, setOrientation] = useState(
    'landscape' as ScreenOrientation
  );

  const keys = Object.keys(breakpoints);

  useMount(() => {
    const breakpointValue = keys
      .map((breakpoint) => {
        const value: ScreenSizeRange = {
          breakpoint: breakpoint as keyof typeof breakpoints,
          min: breakpoints[breakpoint],
          max: 0,
        };

        return value;
      })
      .sort((a, b) => a.min - b.min);

    breakpointValue.reduce((a, b) => {
      if (b) a.max = b.min;

      return b;
    });

    breakpointValue.map((sizeScreen: ScreenSizeRange) => {
      createQuery(
        sizeScreen.breakpoint,
        `only screen ${
          sizeScreen.min && sizeScreen.min >= 0
            ? 'and (min-width:' + sizeScreen.min + 'px)'
            : ''
        } ${
          sizeScreen.max && sizeScreen.max >= 0
            ? 'and (max-width:' + sizeScreen.max + 'px)'
            : ''
        }`,
        setScreen
      );

      // if (
      //   window.innerWidth >= sizeScreen.min &&
      //   window.innerWidth <= sizeScreen.max
      // ) {
      //   setScreen(key as ScreenResponsiveConfig);
      // }
    });

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

  return {
    breakpoints,
    devices,
    orientation,
    screen,
    on,
  };
};
