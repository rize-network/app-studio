import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveProvider } from '../src/providers/Responsive';
import { WindowSizeProvider } from '../src/providers/WindowSize';
import { useResponsive } from '../src/hooks/useResponsive';
import { useWindowSize } from '../src/hooks/useWindowSize';
import { useScroll } from '../src/hooks/useScroll';
import { useClickOutside } from '../src/hooks/useClickOutside';

const meta: Meta = {
  title: 'Hooks/Iframe Support',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;


/**
 * Component rendered inside the iframe
 */
interface IframeContentProps {
  targetWindow?: Window;
  iframeContainer?: React.RefObject<HTMLIFrameElement>;
}

function IframeContent({ targetWindow, iframeContainer }: IframeContentProps) {
  const responsive = useResponsive();
  const windowSize = useWindowSize();
  // Pass the iframe container so useScroll tracks the iframe's scroll, not the parent window
  const scrollPosition = useScroll({ 
    container: iframeContainer,
    throttleMs: 50 
  });
  const [ref, clickedOutside] = useClickOutside<HTMLDivElement>({
    targetWindow,
  });

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '200vh',
      }}
    >
      <div
        ref={ref}
        style={{
          background: clickedOutside ? '#fee' : '#efe',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2>Iframe Content</h2>
        <p>
          Click {clickedOutside ? 'inside' : 'outside'} this box to test
          useClickOutside
        </p>
      </div>

      <div
        style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>Responsive Info</h3>
        <p>
          <strong>Breakpoint:</strong> {responsive.screen}
        </p>
        <p>
          <strong>Device:</strong> {responsive.currentDevice}
        </p>
        <p>
          <strong>Orientation:</strong> {responsive.orientation}
        </p>
        <p>
          <strong>Is Mobile:</strong> {responsive.on('mobile') ? 'Yes' : 'No'}
        </p>
      </div>

      <div
        style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h3>Window Size</h3>
        <p>
          <strong>Width:</strong> {windowSize.width}px
        </p>
        <p>
          <strong>Height:</strong> {windowSize.height}px
        </p>
      </div>

      <div
        style={{
          background: '#f0f0f0',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          position: 'sticky',
          top: '10px',
        }}
      >
        <h3>Scroll Position (Iframe)</h3>
        <p>
          <strong>Y:</strong> {Math.round(scrollPosition.y)}px
        </p>
        <p>
          <strong>Progress:</strong> {Math.round(scrollPosition.yProgress * 100)}
          %
        </p>
      </div>

      <div
        style={{
          background: '#e0e0e0',
          padding: '40px',
          textAlign: 'center',
          borderRadius: '8px',
        }}
      >
        <p>Scroll down to see the scroll position change</p>
        <p style={{ fontSize: '48px', margin: '20px 0' }}>↓</p>
      </div>

      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: `hsl(${i * 36}, 70%, 90%)`,
            padding: '40px',
            margin: '20px 0',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h4>Section {i + 1}</h4>
          <p>Keep scrolling...</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Iframe Portal component
 */
interface IframePortalProps {
  children: (
    iframeWindow: Window,
    iframeRef: React.RefObject<HTMLIFrameElement>
  ) => ReactNode;
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
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
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
        style={{
          width: '100%',
          height: '600px',
          border: '2px solid #ccc',
          borderRadius: '8px',
        }}
      />
      {mountNode &&
        iframeWindow &&
        createPortal(
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

/**
 * Basic iframe support demonstration
 */
export const BasicIframeSupport: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Iframe Support Demo</h1>
      <p>
        Resize the window and scroll inside the iframe to see hooks adapting to
        the iframe context.
      </p>

      <IframePortal>
        {(iframeWindow: Window, iframeRef) => (
          <IframeContent targetWindow={iframeWindow} iframeContainer={iframeRef} />
        )}
      </IframePortal>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9' }}>
        <h2>Instructions</h2>
        <ul>
          <li>Resize your browser window to see responsive breakpoints change</li>
          <li>Scroll inside the iframe to see scroll position tracking</li>
          <li>
            Click inside/outside the green box to see useClickOutside working
          </li>
          <li>
            Notice how all hooks are tracking the iframe's context, not the parent
            window
          </li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison of parent and iframe
 */
export const SideBySideComparison: Story = {
  render: () => {
    const ParentContent = () => {
      const responsive = useResponsive();
      const windowSize = useWindowSize();

      return (
        <div
          style={{
            padding: '20px',
            background: '#e3f2fd',
            borderRadius: '8px',
            height: '600px',
            overflow: 'auto',
          }}
        >
          <h3>Parent Window</h3>
          <div style={{ background: 'white', padding: '15px', borderRadius: '4px' }}>
            <p>
              <strong>Breakpoint:</strong> {responsive.screen}
            </p>
            <p>
              <strong>Device:</strong> {responsive.currentDevice}
            </p>
            <p>
              <strong>Width:</strong> {windowSize.width}px
            </p>
            <p>
              <strong>Height:</strong> {windowSize.height}px
            </p>
          </div>
        </div>
      );
    };

    return (
      <div style={{ padding: '20px' }}>
        <h1>Side-by-Side Comparison</h1>
        <p>
          The left shows the parent window context, the right shows the iframe
          context.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ResponsiveProvider>
            <WindowSizeProvider>
              <ParentContent />
            </WindowSizeProvider>
          </ResponsiveProvider>

          <IframePortal>
            {(iframeWindow: Window, iframeRef) => (
              <div
                style={{
                  padding: '20px',
                  background: '#f3e5f5',
                  borderRadius: '8px',
                }}
              >
                <h3>Iframe Window</h3>
                <IframeContent targetWindow={iframeWindow} iframeContainer={iframeRef} />
              </div>
            )}
          </IframePortal>
        </div>
      </div>
    );
  },
};

/**
 * Multiple iframes
 */
export const MultipleIframes: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Multiple Iframes</h1>
      <p>Each iframe has its own independent context tracking.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Iframe 1</h3>
          <IframePortal>
            {(iframeWindow: Window, iframeRef) => (
              <IframeContent targetWindow={iframeWindow} iframeContainer={iframeRef} />
            )}
          </IframePortal>
        </div>

        <div>
          <h3>Iframe 2</h3>
          <IframePortal>
            {(iframeWindow: Window, iframeRef) => (
              <IframeContent targetWindow={iframeWindow} iframeContainer={iframeRef} />
            )}
          </IframePortal>
        </div>
      </div>
    </div>
  ),
};
