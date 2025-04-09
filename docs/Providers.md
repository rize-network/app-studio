# Providers

App-Studio includes several context providers to manage global state and functionality.

## ThemeProvider

Manages theme context including colors, dark/light mode, and design tokens.

```tsx
import { ThemeProvider } from 'app-studio';

function App() {
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: '#007AFF',
          secondary: '#5856D6'
        },
        spacing: {
          small: 8,
          medium: 16
        }
      }}
      defaultMode="light"
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Usage with useTheme Hook

```tsx
import { useTheme } from 'app-studio';

function ThemedComponent() {
  const { mode, setMode, theme } = useTheme();
  
  return (
    <View 
      backgroundColor={theme.colors.primary}
      padding={theme.spacing.medium}
    >
      <Button onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
    </View>
  );
}
```

## ResponsiveProvider

Manages responsive breakpoints and media queries.

```tsx
import { ResponsiveProvider } from 'app-studio';

function App() {
  return (
    <ResponsiveProvider
      breakpoints={{
        mobile: 0,
        tablet: 768,
        desktop: 1024
      }}
    >
      <YourApp />
    </ResponsiveProvider>
  );
}
```

### Usage with useResponsive Hook

```tsx
import { useResponsive } from 'app-studio';

function ResponsiveComponent() {
  const { screen, on } = useResponsive();
  
  return (
    <View>
      {on('mobile') && <MobileLayout />}
      {on('desktop') && <DesktopLayout />}
    </View>
  );
}
```

## AnalyticsProvider

Provides analytics tracking capabilities throughout the app.

```tsx
import { AnalyticsProvider } from 'app-studio';

function App() {
  return (
    <AnalyticsProvider
      config={{
        trackPageViews: true,
        trackClicks: true
      }}
      onEvent={(event) => {
        // Send to your analytics service
        console.log(event);
      }}
    >
      <YourApp />
    </AnalyticsProvider>
  );
}
```

### Usage with useAnalytics Hook

```tsx
import { useAnalytics } from 'app-studio';

function TrackedComponent() {
  const { trackEvent } = useAnalytics();
  
  return (
    <Button
      onPress={() => trackEvent('button_click', { id: 'main_cta' })}
    >
      Track Me
    </Button>
  );
}
```

## WindowSizeProvider

Provides window dimensions and resize handling.

```tsx
import { WindowSizeProvider } from 'app-studio';

function App() {
  return (
    <WindowSizeProvider>
      <YourApp />
    </WindowSizeProvider>
  );
}
```

### Usage with useWindowSize Hook

```tsx
import { useWindowSize } from 'app-studio';

function ResponsiveLayout() {
  const { width, height } = useWindowSize();
  
  return (
    <View style={{ width: width * 0.8 }}>
      Responsive Container
    </View>
  );
}
```

## Nesting Providers

Typical provider setup for an App-Studio application:

```tsx
function App() {
  return (
    <ThemeProvider>
      <ResponsiveProvider>
        <AnalyticsProvider>
          <WindowSizeProvider>
            <YourApp />
          </WindowSizeProvider>
        </AnalyticsProvider>
      </ResponsiveProvider>
    </ThemeProvider>
  );
}
```