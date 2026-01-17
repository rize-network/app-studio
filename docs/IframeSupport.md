# Iframe Support

App-Studio provides first-class support for rendering components inside iframes. This enables use cases like:

- **Micro-frontend architectures** - Isolate different parts of your application
- **Preview environments** - Render content in sandboxed iframes
- **Design tools** - Build editors with live previews
- **Third-party embeds** - Create embeddable widgets

## Overview

When components render inside an iframe, they need to track scroll, resize, and interaction events relative to the iframe's window—not the parent window. App-Studio hooks and providers automatically support this via `targetWindow` options.

## Supported Hooks & Providers

| Hook/Provider | Iframe Option | Description |
|---------------|---------------|-------------|
| `useScroll` | `container` (iframe ref) | Tracks scroll position inside iframe |
| `useScrollAnimation` | `targetWindow` | Intersection observer for iframe viewport |
| `useScrollDirection` | `targetWindow` | Detects scroll direction in iframe |
| `useSmoothScroll` | `targetWindow` | Smooth scroll within iframe |
| `useClickOutside` | `targetWindow` | Detects clicks outside element in iframe |
| `ResponsiveProvider` | `targetWindow` | Responsive breakpoints for iframe dimensions |
| `WindowSizeProvider` | `targetWindow` | Window size tracking for iframe |

## Quick Start

Here's the minimal setup to render content inside an iframe with full hook support:

```tsx
import { IframePortal } from './IframePortal'; // See Basic Setup below
import { useScroll, useResponsive } from 'app-studio';

function App() {
  return (
    <IframePortal>
      {(iframeWindow, iframeRef) => (
        <MyIframeContent iframeRef={iframeRef} />
      )}
    </IframePortal>
  );
}

function MyIframeContent({ iframeRef }) {
  const { y, yProgress } = useScroll({ container: iframeRef });
  const { screen } = useResponsive();

  return (
    <div style={{ minHeight: '200vh', padding: 20 }}>
      <div style={{ position: 'sticky', top: 10 }}>
        <p>Breakpoint: {screen}</p>
        <p>Scroll: {Math.round(yProgress * 100)}%</p>
      </div>
      <p>Scroll down...</p>
    </div>
  );
}
```

## Basic Setup

The recommended pattern is to use an `IframePortal` component that:
1. Creates an iframe with a mount point
2. Wraps content with providers configured for the iframe's window
3. Uses React's `createPortal` to render into the iframe

```tsx
import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveProvider, WindowSizeProvider } from 'app-studio';

interface IframePortalProps {
  children: (iframeWindow: Window, iframeRef: React.RefObject<HTMLIFrameElement>) => ReactNode;
}

function IframePortal({ children }: IframePortalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow?.document) return;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { margin: 0; padding: 0; }</style>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    doc.close();

    setIframeWindow(iframe.contentWindow);
    setMountNode(doc.getElementById('root'));
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        style={{ width: '100%', height: '600px', border: '2px solid #ccc' }}
      />
      {mountNode && iframeWindow && createPortal(
        <ResponsiveProvider targetWindow={iframeWindow}>
          <WindowSizeProvider targetWindow={iframeWindow}>
            {children(iframeWindow, iframeRef)}
          </WindowSizeProvider>
        </ResponsiveProvider>,
        mountNode
      )}
    </>
  );
}
```

## Hook Examples

### useScroll with Iframe

Track scroll position inside an iframe by passing the iframe element reference:

```tsx
import { useRef } from 'react';
import { useScroll } from 'app-studio';

function IframeScrollTracker() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Pass iframe ref - automatically tracks iframe's scroll
  const { y, yProgress } = useScroll({
    container: iframeRef,
    throttleMs: 50
  });

  return (
    <div>
      <p>Scroll Y: {Math.round(y)}px</p>
      <p>Progress: {Math.round(yProgress * 100)}%</p>
      <iframe ref={iframeRef} src="/content" />
    </div>
  );
}
```

### useScrollAnimation with Iframe

The hook auto-detects iframe context from the element's `ownerDocument`, or you can explicitly pass `targetWindow`:

```tsx
import { useRef } from 'react';
import { useScrollAnimation } from 'app-studio';

function AnimatedSection({ targetWindow }: { targetWindow?: Window }) {
  const ref = useRef<HTMLDivElement>(null);

  const { isInView, progress } = useScrollAnimation(ref, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    targetWindow, // Optional: explicitly set iframe window
  });

  return (
    <div
      ref={ref}
      style={{
        opacity: 0.3 + progress * 0.7,
        transform: `scale(${0.85 + progress * 0.15})`,
      }}
    >
      {isInView ? 'In View' : 'Out of View'} - {(progress * 100).toFixed(0)}%
    </div>
  );
}
```

### useScrollDirection with Iframe

```tsx
import { useScrollDirection } from 'app-studio';

function IframeScrollIndicator({ iframeWindow }: { iframeWindow: Window }) {
  const direction = useScrollDirection(5, iframeWindow);

  return <div>Scrolling: {direction}</div>;
}
```

### useSmoothScroll with Iframe

```tsx
import { useRef } from 'react';
import { useSmoothScroll } from 'app-studio';

function IframeNavigation({ iframeWindow }: { iframeWindow: Window }) {
  const scrollTo = useSmoothScroll(iframeWindow);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <button onClick={() => scrollTo(sectionRef.current, 80)}>
        Scroll to Section
      </button>
      <div ref={sectionRef}>Target Section</div>
    </>
  );
}
```

### useClickOutside with Iframe

```tsx
import { useState } from 'react';
import { useClickOutside } from 'app-studio';

function IframeDropdown({ targetWindow }: { targetWindow: Window }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, clickedOutside] = useClickOutside<HTMLDivElement>({
    targetWindow,
  });

  return (
    <div
      ref={ref}
      style={{ background: clickedOutside ? '#fee' : '#efe' }}
    >
      Click outside to detect
    </div>
  );
}
```

## Complete Example

Here's a full example rendering interactive content inside an iframe:

```tsx
import { useRef } from 'react';
import {
  useScroll,
  useScrollAnimation,
  useResponsive,
  useWindowSize,
  useClickOutside
} from 'app-studio';

function IframeContent({
  targetWindow,
  iframeContainer
}: {
  targetWindow: Window;
  iframeContainer: React.RefObject<HTMLIFrameElement>;
}) {
  const responsive = useResponsive();
  const windowSize = useWindowSize();
  const scrollPosition = useScroll({
    container: iframeContainer,
    throttleMs: 50
  });
  const [clickRef, clickedOutside] = useClickOutside<HTMLDivElement>({
    targetWindow,
  });

  return (
    <div style={{ padding: 20, minHeight: '200vh' }}>
      {/* Click detection box */}
      <div
        ref={clickRef}
        style={{
          background: clickedOutside ? '#fee' : '#efe',
          padding: 20,
          borderRadius: 8,
        }}
      >
        <h2>Interactive Box</h2>
        <p>Click {clickedOutside ? 'inside' : 'outside'} to test</p>
      </div>

      {/* Responsive info */}
      <div style={{ marginTop: 20 }}>
        <p><strong>Breakpoint:</strong> {responsive.screen}</p>
        <p><strong>Device:</strong> {responsive.currentDevice}</p>
        <p><strong>Size:</strong> {windowSize.width}x{windowSize.height}</p>
      </div>

      {/* Scroll info */}
      <div style={{ position: 'sticky', top: 10, marginTop: 20 }}>
        <p><strong>Scroll Y:</strong> {Math.round(scrollPosition.y)}px</p>
        <p><strong>Progress:</strong> {Math.round(scrollPosition.yProgress * 100)}%</p>
      </div>

      {/* Scrollable sections */}
      {Array.from({ length: 10 }).map((_, i) => (
        <AnimatedSection key={i} index={i} targetWindow={targetWindow} />
      ))}
    </div>
  );
}

function AnimatedSection({ index, targetWindow }: { index: number; targetWindow: Window }) {
  const ref = useRef<HTMLDivElement>(null);
  const { isInView, progress } = useScrollAnimation(ref, {
    threshold: [0, 0.5, 1],
    targetWindow,
  });

  return (
    <div
      ref={ref}
      style={{
        padding: 40,
        margin: '20px 0',
        borderRadius: 8,
        background: `hsl(${index * 36}, 70%, ${isInView ? 85 : 95}%)`,
        opacity: 0.3 + progress * 0.7,
        transform: `translateY(${(1 - progress) * 20}px)`,
        transition: 'all 0.3s',
      }}
    >
      Section {index + 1} - {isInView ? 'Visible' : 'Hidden'}
    </div>
  );
}

// Usage with IframePortal
function App() {
  return (
    <IframePortal>
      {(iframeWindow, iframeRef) => (
        <IframeContent
          targetWindow={iframeWindow}
          iframeContainer={iframeRef}
        />
      )}
    </IframePortal>
  );
}
```

## More Examples

### Scroll Progress Bar in Iframe

A progress bar that fills as the user scrolls inside the iframe:

```tsx
function IframeProgressBar({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement> }) {
  const { yProgress } = useScroll({ container: iframeRef, throttleMs: 16 });

  return (
    <div style={{ padding: 20, minHeight: '300vh' }}>
      {/* Sticky progress bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: 4,
        background: '#eee',
        zIndex: 100
      }}>
        <div style={{
          height: '100%',
          width: `${yProgress * 100}%`,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          transition: 'width 0.1s ease-out',
        }} />
      </div>

      {/* Content */}
      <h1>Article Title</h1>
      <p>Scroll to see the progress bar fill...</p>
      {Array.from({ length: 20 }).map((_, i) => (
        <p key={i}>Paragraph {i + 1}...</p>
      ))}
    </div>
  );
}
```

### Responsive Layout in Iframe

Detect iframe dimensions for responsive layouts:

```tsx
function ResponsiveIframeLayout() {
  const { screen, on } = useResponsive();
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: on('mobile') ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
      }}>
        <Card title="Card 1" />
        <Card title="Card 2" />
        <Card title="Card 3" />
      </div>

      <p style={{ marginTop: 20, color: '#666' }}>
        Iframe: {width}x{height} ({screen})
      </p>
    </div>
  );
}

function Card({ title }: { title: string }) {
  return (
    <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
      {title}
    </div>
  );
}
```

### Animated Sections with Progress Indicator

Sections that animate in with a visual progress indicator:

```tsx
function ScrollAnimationSection({ index, targetWindow }: {
  index: number;
  targetWindow?: Window;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isInView, progress } = useScrollAnimation(sectionRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    targetWindow,
  });

  return (
    <div
      ref={sectionRef}
      style={{
        padding: '60px 40px',
        margin: '40px 20px',
        borderRadius: 16,
        background: `linear-gradient(135deg,
          hsl(${index * 60}, 70%, ${isInView ? 85 : 95}%) 0%,
          hsl(${index * 60 + 30}, 70%, ${isInView ? 75 : 90}%) 100%)`,
        opacity: 0.3 + progress * 0.7,
        transform: `scale(${0.85 + progress * 0.15}) translateY(${(1 - progress) * 20}px)`,
        transition: 'all 0.4s ease-out',
        boxShadow: isInView
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <h3>Section {index + 1}</h3>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <span style={{
          padding: '6px 12px',
          borderRadius: 20,
          background: isInView ? '#4CAF50' : '#ccc',
          color: isInView ? 'white' : '#666',
          fontSize: 14,
        }}>
          {isInView ? '✓ In View' : '○ Out of View'}
        </span>
        <span style={{
          padding: '6px 12px',
          borderRadius: 20,
          background: 'rgba(0,0,0,0.1)',
          fontSize: 14,
        }}>
          {(progress * 100).toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        marginTop: 16,
        height: 8,
        borderRadius: 4,
        background: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          borderRadius: 4,
          background: `hsl(${index * 60}, 70%, 50%)`,
          transition: 'width 0.1s ease-out',
        }} />
      </div>
    </div>
  );
}
```

### Side-by-Side Parent vs Iframe Comparison

Compare values between parent window and iframe:

```tsx
function SideBySideDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Parent window context */}
      <ResponsiveProvider>
        <WindowSizeProvider>
          <ParentInfo />
        </WindowSizeProvider>
      </ResponsiveProvider>

      {/* Iframe context */}
      <IframePortal>
        {(iframeWindow, iframeRef) => (
          <IframeInfo iframeRef={iframeRef} />
        )}
      </IframePortal>
    </div>
  );
}

function ParentInfo() {
  const { screen } = useResponsive();
  const { width, height } = useWindowSize();

  return (
    <div style={{ padding: 20, background: '#e3f2fd', borderRadius: 8 }}>
      <h3>Parent Window</h3>
      <p>Breakpoint: {screen}</p>
      <p>Size: {width}x{height}</p>
    </div>
  );
}

function IframeInfo({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement> }) {
  const { screen } = useResponsive();
  const { width, height } = useWindowSize();
  const { yProgress } = useScroll({ container: iframeRef });

  return (
    <div style={{ padding: 20, background: '#f3e5f5', minHeight: '150vh' }}>
      <div style={{ position: 'sticky', top: 10 }}>
        <h3>Iframe Window</h3>
        <p>Breakpoint: {screen}</p>
        <p>Size: {width}x{height}</p>
        <p>Scroll: {Math.round(yProgress * 100)}%</p>
      </div>
    </div>
  );
}
```

### Multiple Independent Iframes

Each iframe tracks its own scroll independently:

```tsx
function MultipleIframesDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 20 }}>
      <div>
        <h3>Iframe 1</h3>
        <IframePortal>
          {(_, iframeRef) => <ScrollableContent iframeRef={iframeRef} color="blue" />}
        </IframePortal>
      </div>
      <div>
        <h3>Iframe 2</h3>
        <IframePortal>
          {(_, iframeRef) => <ScrollableContent iframeRef={iframeRef} color="purple" />}
        </IframePortal>
      </div>
    </div>
  );
}

function ScrollableContent({
  iframeRef,
  color
}: {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  color: string;
}) {
  const { y, yProgress } = useScroll({ container: iframeRef });

  const bgColor = color === 'blue' ? '#e3f2fd' : '#f3e5f5';
  const accentColor = color === 'blue' ? '#2196f3' : '#9c27b0';

  return (
    <div style={{ padding: 20, minHeight: '200vh', background: bgColor }}>
      <div style={{
        position: 'sticky',
        top: 10,
        background: 'white',
        padding: 16,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <p style={{ margin: 0 }}>
          <strong>Scroll Y:</strong> {Math.round(y)}px
        </p>
        <div style={{
          marginTop: 8,
          height: 8,
          background: '#eee',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${yProgress * 100}%`,
            height: '100%',
            background: accentColor,
          }} />
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{
          marginTop: 20,
          padding: 30,
          background: 'white',
          borderRadius: 8,
          borderLeft: `4px solid ${accentColor}`,
        }}>
          Section {i + 1}
        </div>
      ))}
    </div>
  );
}
```

## How It Works

### Auto-Detection

Several hooks automatically detect iframe context:

1. **`useScrollAnimation`** - Uses the element's `ownerDocument.defaultView` to get the correct `IntersectionObserver` from the iframe's window context
2. **`useScroll`** - When passed an `HTMLIFrameElement`, extracts `contentWindow` and `contentDocument` automatically

### Manual Configuration

For explicit control, pass `targetWindow` directly:

```tsx
// Get iframe window reference
const iframeWindow = iframeRef.current?.contentWindow;

// Pass to hooks
useScrollDirection(5, iframeWindow);
useSmoothScroll(iframeWindow);
useScrollAnimation(ref, { targetWindow: iframeWindow });
```

### Provider Setup

Wrap iframe content with providers configured for the iframe window:

```tsx
<ResponsiveProvider targetWindow={iframeWindow}>
  <WindowSizeProvider targetWindow={iframeWindow}>
    {/* Your iframe content */}
  </WindowSizeProvider>
</ResponsiveProvider>
```

## Best Practices

1. **Always wrap with providers** - Ensure `ResponsiveProvider` and `WindowSizeProvider` have `targetWindow` set for accurate breakpoint detection

2. **Pass iframe ref for scroll tracking** - Use `container: iframeRef` with `useScroll` to track the iframe's scroll position

3. **Use auto-detection when possible** - `useScrollAnimation` auto-detects iframe context, reducing boilerplate

4. **Handle cross-origin restrictions** - If the iframe loads cross-origin content, you won't have access to `contentWindow`. These hooks work with same-origin iframes only.

5. **Clean up event listeners** - All hooks handle cleanup automatically when components unmount

## Troubleshooting

### Common Issues

**Scroll position always returns 0:**

```tsx
// ❌ Wrong: Using window scroll in iframe
const { y } = useScroll(); // Tracks parent window, not iframe

// ✅ Correct: Pass iframe ref
const { y } = useScroll({ container: iframeRef });
```

**Responsive breakpoints don't match iframe size:**

```tsx
// ❌ Wrong: Provider without targetWindow
<ResponsiveProvider>
  <IframeContent /> {/* Uses parent window dimensions */}
</ResponsiveProvider>

// ✅ Correct: Pass targetWindow to provider
<ResponsiveProvider targetWindow={iframeWindow}>
  <IframeContent /> {/* Uses iframe dimensions */}
</ResponsiveProvider>
```

**IntersectionObserver not detecting elements in iframe:**

```tsx
// ❌ Wrong: Using parent window's observer
const { isInView } = useScrollAnimation(ref);

// ✅ Correct: Pass targetWindow or let it auto-detect
const { isInView } = useScrollAnimation(ref, { targetWindow: iframeWindow });
// Or render inside iframe where auto-detection works
```

**Cross-origin iframe access denied:**

```tsx
// This will fail for cross-origin iframes
const iframeWindow = iframeRef.current?.contentWindow; // SecurityError

// Solution: Only use same-origin iframes for these hooks
// Or use postMessage for cross-origin communication
```

## Storybook Examples

See the interactive examples in Storybook:

- [BasicIframeSupport](../stories/IframeSupport.stories.tsx) - Basic demo of all hooks working in iframe
- [SideBySideComparison](../stories/IframeSupport.stories.tsx) - Compare parent vs iframe contexts
- [MultipleIframes](../stories/IframeSupport.stories.tsx) - Independent tracking across multiple iframes
- [ScrollAnimationInIframe](../stories/IframeSupport.stories.tsx) - `useScrollAnimation` with `targetWindow`

Run Storybook to see these examples:

```bash
npm run storybook
```
