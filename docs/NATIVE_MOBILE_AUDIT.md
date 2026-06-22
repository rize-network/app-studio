# App Studio — Native Mobile Audit & Strategy

Scope: `app-studio` (core) and `@app-studio/components`, targeting **bare React Native**
(not Expo). This document audits cross‑platform behavior and defines the strategy that
the accompanying code changes implement.

App Studio ships two builds from one source tree:

| Build | Entry | Renders with | Styling |
|-------|-------|--------------|---------|
| web | `dist/web` (`src/web`, `src/element`, `src/components`) | DOM (`div`, `span`, …) | generated CSS utility classes (`src/element/css.ts`) |
| native | `dist/native` (`src/native`) | RN primitives (`View`, `Text`, `Pressable`, …) | inline `StyleSheet` objects (`src/native/style.ts`) |

`View`, `Horizontal`, `Vertical`, `Center`, `Scroll`, `SafeArea` are thin wrappers over a
single `Element`. The web `Element` lives in `src/element/Element.tsx`; the native one in
`src/native/components.tsx`. **Any prop added to `Element` is available on every view.**

---

## Part 1 — Native Animation Audit

### How animation works today

**Web** (`src/element/Element.tsx` + `src/element/css.ts` + `src/element/Animation.tsx`)

- The `animate` prop accepts CSS‑shaped `AnimationProps` produced by the `Animation.*`
  factories (`fadeIn`, `slideInLeft`, `bounce`, …). `AnimationUtils.processAnimations`
  turns each into a real `@keyframes` rule + `animation-*` longhands.
- `animateIn` plays on viewport entry via `IntersectionObserver`; `animateOut` plays on
  unmount; `animateOn` (`'View' | 'Scroll' | 'Both' | 'Mount'`) attaches CSS
  **scroll‑driven timelines** (`animation-timeline: view()/scroll()`, `animation-range`).
- 40+ animation factories exist, including a whole family of **scroll‑timeline** ones
  (`fadeInScroll`, `slideInLeftScroll`, `fillTextScroll`, `unclipScroll`, …) that depend on
  CSS `scroll()` / `view()` / custom `--timeline` — these are **web‑only** by nature.

**Native** (`src/native/useAnimation.ts`)

- `react-native-reanimated` is an **optional** peer, lazy‑`require`d. The same
  `AnimationProps` shape is parsed: durations (`'0.5s'`/`300`), `timingFunction`→`Easing`,
  `iterationCount`/`direction`→`withRepeat`, multi‑stop keyframes→`withSequence`, and CSS
  `transform` strings→RN transform entries. Runs on Reanimated's UI thread (off the JS
  thread). Good baseline.

### Findings (what's weak / broken on native)

| # | Issue | Impact | File |
|---|-------|--------|------|
| 1 | **Reanimated peer often absent.** When missing, `useAnimation` returns a no‑op and views render static. `app-studio-rn-app` does **not** install reanimated and has **no babel plugin** configured → *all* native `animate` props are currently silent no‑ops. | High — animations simply don't play | `src/native/useAnimation.ts`; `app-studio-rn-app/babel.config.js` |
| 2 | **Only the first animation** in an `animate` array is honored. | Medium | `useAnimation.ts:249` |
| 3 | **Fixed key roster.** Only a hardcoded set of props animate (`opacity`, transforms, a few colors/sizes). Anything else in a keyframe is silently dropped. | Medium | `useAnimation.ts:260` |
| 4 | **`%` translate resolved against a module‑load `Dimensions.get('window')`** snapshot — not element size, not reactive to rotation. `slideInLeft('-100%')` slides by the *screen* width, captured once. | Medium (wrong on rotate / split‑view) | `useAnimation.ts:89` |
| 5 | **`animateIn` / `animateOut` / `animateOn` are ignored** on native. Mount‑in animations authored with `animateIn` never play. | High (common pattern) | `src/native/components.tsx` |
| 6 | **Scroll‑driven animations** (`animateOn='Scroll'`, `timeline`/`range`, the `*Scroll` factories) have **no native equivalent** and are silently ignored. | Expected, but undocumented | `useAnimation.ts` |
| 7 | **`@app-studio/components`: CSS‑transition animations don't run on native.** Carousel, Sidebar, Accordion, Card, Modal, Toast, Tooltip, form controls animate via CSS `transition:`/`@keyframes` on web; on native those props are stripped, so state changes snap instantly (no jank, but no motion). | Medium (polish) | `app-studio-components/src/components/*/*.style.ts` |
| 8 | `useInView`/`useHover`/`useScroll` are **constant stubs** on native (`src/native/hooks.ts`) → viewport/hover/scroll‑triggered effects fire immediately or never. | Medium | `src/native/hooks.ts` |

### Strategy

1. **Reanimated is the right native engine** — keep it. It runs animations on the UI
   thread via worklets, so it does not block JS. Do **not** port CSS transitions onto
   native; instead expose the shared `Animation.*` declarative API (already the case) and
   make the native interpreter faithful.
2. **Shared API, platform‑specific impl** (already the shape). Keep `Animation.*` factories
   as the one authoring surface. Web → CSS; native → Reanimated.
3. **Fixes applied in this change set** (low‑risk, high‑value):
   - Native `Element` now falls back to `animateIn` when `animate` is absent, so mount
     animations author identically on both platforms (Finding 5).
   - `%` translates resolve against **live** window dimensions read at animation start, not
     a stale module snapshot (Finding 4).
   - The no‑op path is documented and detectable via `isAnimationSupported`, and the RN
     app gains the reanimated babel‑plugin guidance + provider wiring (Finding 1).
4. **Documented as web‑only:** scroll‑driven timelines and CSS‑transition micro‑interactions
   (Findings 6, 7). These degrade gracefully (no motion) on native by design — never force
   a web pattern onto native if it isn't performant.
5. **Future** (not in this pass, tracked here): multi‑animation composition (Finding 2),
   open key roster (Finding 3), real `useInView` via `onLayout`+scroll offset for
   viewport‑triggered native animation (Finding 8).

---

## Part 2 — Safe Area / Native Insets

### State before this change

- **Web `SafeArea`** = `<Element overflow="auto">` — a stub; does nothing about insets.
- **Native `SafeArea`** = RN's built‑in `<SafeAreaView>` — iOS‑only, top/bottom only, not
  per‑edge, and ignores `react-native-safe-area-context` (which *is* installed in the RN
  app, v5.x). On Android it does nothing.
- **No per‑view safe‑area props.** A `<View>` could overlap the status bar, notch, camera
  island, or home indicator with no clean opt‑in.
- The bare RN app does **not** mount `SafeAreaProvider`, so even manual `useSafeAreaInsets`
  returns zeros.
- Founder's prior art (`app-demo`) used an opt‑in `<View safe>` over RN `SafeAreaView` plus
  `react-native-static-safe-area-insets` for the iOS bottom — simple, but iOS‑centric and
  not per‑edge.

### Design (implemented)

Every view accepts a small, declarative safe‑area API. Insets are applied **additively**
over existing padding (or margin), matching `react-native-safe-area-context` semantics, so
content never sits *under* system UI.

```
safeArea        boolean | 'all' | Edge | Edge[]   // true/'all' = all four edges
safeAreaTop     boolean                            // per-edge override (wins over safeArea)
safeAreaBottom  boolean
safeAreaLeft    boolean
safeAreaRight   boolean
safeAreaEdges   Edge[]                             // explicit edge list (merges with safeArea)
ignoreSafeArea  boolean                            // force-off, wins over everything
safeAreaMode    'padding' | 'margin'               // how the inset is applied (default 'padding')
```
`Edge = 'top' | 'right' | 'bottom' | 'left'`.

**Resolution precedence** (`resolveSafeAreaEdges`): `ignoreSafeArea` → off everything;
else start from `safeArea`, merge `safeAreaEdges`, then per‑edge booleans win last.

- **Web:** each enabled edge becomes `padding<Edge>: calc(<existing> + env(safe-area-inset-<edge>, 0px))`
  (or `margin<Edge>` when `safeAreaMode='margin'`). Requires the document to opt into
  `viewport-fit=cover` (`<meta name="viewport" content="…, viewport-fit=cover">`); harmless
  when insets are 0.
- **Native:** `useSafeArea` reads live insets from `react-native-safe-area-context`
  (optional peer, lazy‑required) and adds them to the resolved base padding/margin per edge.
  Needs `<SafeAreaProvider>` at the app root.

Both platforms share one resolver and prop list (`src/utils/safeArea.ts`), so behavior is
identical and the props live on `Element` → on every view.

### Required app wiring (bare RN)

1. `npm i react-native-safe-area-context` (already present in `app-studio-rn-app`).
2. Wrap the root in `<SafeAreaProvider>` (added to `app-studio-rn-app/App.tsx`).
3. For web, add `viewport-fit=cover` to the viewport meta.

---

## Part 3 — App initialization, launch screen & icons (bare RN)

Centralized, copy‑pasteable setup (see `app-studio-rn-app` scripts and
`docs/NATIVE_SETUP.md`):

- **Init providers**: `SafeAreaProvider` → `ThemeProvider` → `ResponsiveProvider` →
  `WindowSizeProvider` at the root.
- **Reanimated**: add `react-native-reanimated` + its babel plugin (must be **last** in the
  plugin list) to enable native animations.
- **Launch screen**: `react-native-bootsplash` — `npx react-native generate-bootsplash`
  (founder's prior approach in `app-demo`).
- **App icons**: `react-native set-icon --path <icon.png>` (founder's prior approach).
- **Android edge‑to‑edge**: Android 15 enforces edge‑to‑edge; safe‑area props now make
  this safe by keeping content out of the system bars.

See `docs/NATIVE_SETUP.md` for the concrete, runnable steps.

---

## Part 4 — React Native render performance

Every `@app-studio/components` component renders through the native `Element` /
`useNativeStyle` path, so the highest-leverage performance work is there — it
lifts all ~56 components at once, rather than micro-optimizing each.

### Findings (before)

| # | Issue | Impact | File |
|---|-------|--------|------|
| 1 | **Style recomputed every render.** `useNativeStyle` memoized on the whole `props` object, but callers always spread a fresh `props`, so the `useMemo` never hit — it rebuilt the StyleSheet object *and returned a new reference* on every render of every view. | High — wasted CPU + breaks all downstream bail-outs | `src/native/style.ts` |
| 2 | **Native `Element` not memoized.** The web `Element` is `React.memo`'d; the native one wasn't, so any parent re-render walked the entire subtree. | High | `src/native/components.tsx` |
| 3 | **Animation objects recreated in hot render paths.** `TypewriterEffect` built `Animation.flash()` inline on every keystroke; the native animation hook keys its effect on object identity, so the cursor blink *restarted every character*. | Medium (visible jank) | `app-studio-components/.../TypewriterEffect.native.tsx` |

### Fixes (applied)

1. **Stable, hash-keyed style cache** (`useNativeStyle`). A ref cache keyed by a
   hash of only the *style-relevant* props (plus the resolved theme and the
   matched breakpoint) recomputes the StyleSheet object **only on a real change**
   and returns a **stable reference** across renders. Two wins:
   - Style work happens once per distinct style, not once per render.
   - The stable reference lets RN skip host-prop re-diffing and lets memoized
     children bail out. Elements **without** a `media` prop no longer recompute
     on resize at all (only the matched breakpoint is keyed, not raw width).
2. **`React.memo` on the native `Element`** (and on the hottest leaves: `Text`,
   `Image`, `Button`). A parent re-render with unchanged props now skips the
   element and its style work. Context updates (theme / responsive / safe-area
   insets) still re-render — `React.memo` only blocks parent-driven re-renders —
   so dynamic theming/responsiveness keep working.
3. **Hoisted invariant animations to module constants** where a component
   re-renders frequently (`TypewriterEffect` cursor), so the Reanimated loop
   stays alive instead of restarting each render.

`SlideEffect` / `Title` recreate animations only on infrequent phase/parent
changes (timeout-driven, not per-frame), so they were left as-is.

### Guidance for component authors (native)

- Pass **stable** `animate` objects (module constant or `useMemo`) — a new
  object identity restarts the native animation.
- Avoid inline `style={{…}}` / inline handler props on hot lists; prefer App
  Studio style props (now cached) and `useCallback`.
- For long/unbounded lists, prefer `FlatList` (virtualized) over
  `ScrollView` + `.map`.
</content>
</invoke>
