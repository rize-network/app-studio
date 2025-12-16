import React, { createContext, useContext, useMemo } from 'react';
import {
  UtilityClassManager,
  utilityClassManager as globalManager,
  propertyShorthand,
} from '../element/css';

/**
 * Context to hold the style manager instance.
 */
interface StyleRegistryContextValue {
  manager: UtilityClassManager;
}

const StyleRegistryContext = createContext<StyleRegistryContextValue>({
  manager: globalManager,
});

/**
 * Hook to access the current style manager.
 */
export const useStyleRegistry = () => useContext(StyleRegistryContext);

interface StyleRegistryProps {
  registry?: UtilityClassManager;
  children: React.ReactNode;
}

/**
 * Provider to wrap the app and manage styles.
 * When doing SSR, pass a new registry created via createStyleRegistry().
 */
export const StyleRegistry = ({ registry, children }: StyleRegistryProps) => {
  const value = useMemo(
    () => ({
      // If no registry provided, fallback to globalManager
      manager: registry || globalManager,
    }),
    [registry]
  );

  return (
    <StyleRegistryContext.Provider value={value}>
      {children}
    </StyleRegistryContext.Provider>
  );
};

/**
 * Helper to create a new style registry (UtilityClassManager) instance.
 * Useful for SSR to create a fresh manager per request.
 */
export const createStyleRegistry = () => {
  return new UtilityClassManager(propertyShorthand, 10000);
};

/**
 * React hook to get the CSS string from the registry.
 * Note: This only works if you're using a fresh registry that collected styles.
 */
export const useServerInsertedHTML = (registry: UtilityClassManager) => {
  return () => {
    return (
      <style
        id="app-studio-server-css"
        dangerouslySetInnerHTML={{ __html: registry.getServerStyles() }}
      />
    );
  };
};
