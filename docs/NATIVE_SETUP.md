# App Studio — Bare React Native Setup

Concrete, runnable steps to make an App Studio app feel professionally native on
**bare React Native** (not Expo). Pairs with `NATIVE_MOBILE_AUDIT.md`.

## 1. Providers (app root)

Mount `SafeAreaProvider` ABOVE App Studio's providers so safe-area insets are
available to every view:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemeProvider,
  ResponsiveProvider,
  WindowSizeProvider,
} from 'app-studio';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ResponsiveProvider>
          <WindowSizeProvider>
            {/* app */}
          </WindowSizeProvider>
        </ResponsiveProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
```

Without `SafeAreaProvider`, `safeArea*` props/`<SafeArea>` resolve to **zero**
insets (graceful no-op — they don't crash).

## 2. Safe area on any view

Every view accepts the safe-area props (they live on `Element`):

```tsx
<View safeArea>…</View>                         {/* all four edges */}
<View safeAreaTop safeAreaBottom>…</View>        {/* per-edge */}
<View safeAreaEdges={['top', 'left', 'right']}>…</View>
<View safeArea safeAreaBottom={false}>…</View>   {/* all but bottom */}
<View safeArea ignoreSafeArea>…</View>           {/* force OFF */}
<View safeArea safeAreaMode="margin">…</View>    {/* inset as margin, not padding */}
<SafeArea>…</SafeArea>                            {/* shorthand: all edges */}
```

Insets are **additive** over your existing padding, e.g.
`<View padding={16} safeAreaTop>` → top padding = `16 + insets.top`.

**Web:** also add `viewport-fit=cover` so `env(safe-area-inset-*)` is non-zero:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

## 3. Native animations (Reanimated)

App Studio's `animate` / `animateIn` props play on the UI thread via
`react-native-reanimated`. It is an optional peer — install + configure it:

```sh
npm i react-native-reanimated
cd ios && pod install
```

`babel.config.js` — the reanimated plugin MUST be **last**:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // keep last
};
```

Then `<View animate={Animation.fadeIn()}>` / `<View animateIn={Animation.slideInUp()}>`
animate natively. If reanimated is missing, App Studio logs one dev warning and
renders the view static (no crash). CSS scroll-driven animations
(`animateOn="Scroll"`, `*Scroll` factories) are **web-only** and degrade to no
motion on native — by design.

## 4. Launch screen (react-native-bootsplash)

```sh
npm i react-native-bootsplash
# place a square logo at assets/app/splash.png, then:
npm run splash        # = react-native generate-bootsplash assets/app/splash.png …
cd ios && pod install
```

Hide it once the app is ready:

```tsx
import BootSplash from 'react-native-bootsplash';
// after first render / data load:
BootSplash.hide({ fade: true });
```

## 5. App icons (react-native-set-icon)

```sh
npm i -D react-native-set-icon
# place a 1024×1024 icon at assets/app/icon.png, then:
npm run icon          # = react-native set-icon --path assets/app/icon.png
```

Generates all iOS `AppIcon.appiconset` sizes and Android `mipmap-*` densities.

## 6. Android edge-to-edge & status bar

Android 15 enforces edge-to-edge. With the safe-area props above, content stays
clear of the system bars. Control the status bar with RN's `<StatusBar>`:

```tsx
import { StatusBar } from 'react-native';
<StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
```

For a translucent edge-to-edge status bar on Android, set
`android:windowTranslucentStatus`/`enableEdgeToEdge` in your theme and rely on
`safeAreaTop` to pad content below the bar.
