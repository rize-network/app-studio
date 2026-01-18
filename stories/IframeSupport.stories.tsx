import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveProvider } from '../src/providers/Responsive';
import { WindowSizeProvider } from '../src/providers/WindowSize';
import { useResponsive } from '../src/hooks/useResponsive';
import { useWindowSize } from '../src/hooks/useWindowSize';
import { useScroll, useScrollAnimation } from '../src/hooks/useScroll';
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

/**
 * Scroll Animation in iframe with targetWindow support
 * Demonstrates useScrollAnimation hook properly detecting iframe context
 */
interface ScrollAnimationSectionProps {
  index: number;
  targetWindow?: Window;
}

function ScrollAnimationSection({ index, targetWindow }: ScrollAnimationSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Auto-detect iframe context or use explicit targetWindow
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
        borderRadius: '16px',
        background: `linear-gradient(135deg, hsl(${index * 60}, 70%, ${isInView ? '85%' : '95%'}) 0%, hsl(${index * 60 + 30}, 70%, ${isInView ? '75%' : '90%'}) 100%)`,
        opacity: 0.3 + progress * 0.7,
        transform: `scale(${0.85 + progress * 0.15}) translateY(${(1 - progress) * 20}px)`,
        transition: 'background 0.3s ease, opacity 0.4s ease-out, transform 0.4s ease-out',
        boxShadow: isInView 
          ? '0 20px 40px rgba(0,0,0,0.15)' 
          : '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontFamily: 'system-ui, sans-serif', fontSize: '24px' }}>
        Section {index + 1}
      </h3>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap',
        fontFamily: 'monospace',
        fontSize: '14px',
      }}>
        <span style={{ 
          padding: '6px 12px', 
          borderRadius: '20px', 
          background: isInView ? '#4CAF50' : '#ccc',
          color: isInView ? 'white' : '#666',
          transition: 'all 0.3s ease',
        }}>
          {isInView ? '✓ In View' : '○ Out of View'}
        </span>
        <span style={{ 
          padding: '6px 12px', 
          borderRadius: '20px', 
          background: 'rgba(0,0,0,0.1)',
        }}>
          Progress: {(progress * 100).toFixed(0)}%
        </span>
      </div>
      <div style={{
        marginTop: '16px',
        height: '8px',
        borderRadius: '4px',
        background: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          borderRadius: '4px',
          background: `hsl(${index * 60}, 70%, 50%)`,
          transition: 'width 0.1s ease-out',
        }} />
      </div>
    </div>
  );
}

function ScrollAnimationIframeContent({ targetWindow }: { targetWindow?: Window }) {
  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '10px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 100,
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
          useScrollAnimation with targetWindow
        </h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Scroll to see sections animate in. The hook auto-detects iframe context.
        </p>
      </div>

      {Array.from({ length: 6 }).map((_, i) => (
        <ScrollAnimationSection key={i} index={i} targetWindow={targetWindow} />
      ))}

      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666',
      }}>
        <p>🎉 You've reached the end!</p>
      </div>
    </div>
  );
}

export const ScrollAnimationInIframe: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>useScrollAnimation with Iframe Support</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This demonstrates the <code>targetWindow</code> option for <code>useScrollAnimation</code>.
        The hook automatically detects when elements are inside an iframe and uses the correct root for intersection observation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3 style={{ marginBottom: '10px' }}>Auto-detect (no targetWindow)</h3>
          <IframePortal>
            {() => (
              <ScrollAnimationIframeContent />
            )}
          </IframePortal>
        </div>

        <div>
          <h3 style={{ marginBottom: '10px' }}>Explicit targetWindow</h3>
          <IframePortal>
            {(iframeWindow: Window) => (
              <ScrollAnimationIframeContent targetWindow={iframeWindow} />
            )}
          </IframePortal>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Usage</h3>
        <pre style={{ 
          background: '#282c34', 
          color: '#abb2bf', 
          padding: '16px', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '14px',
        }}>
{`// Auto-detect iframe context from element's document
const { isInView, progress } = useScrollAnimation(ref, { 
  threshold: 0.5 
});

// Or explicitly pass the iframe window
const { isInView, progress } = useScrollAnimation(ref, { 
  threshold: 0.5,
  targetWindow: iframeRef.current?.contentWindow 
});`}
        </pre>
      </div>
    </div>
  ),
};

/**
 * Sticky Scroll using useScroll's elementProgress in Iframe
 */
function StickyScrollIframeContent() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // This uses the new feature: tracking element progress for sticky animations
  const { elementProgress } = useScroll({ 
    container: wrapperRef,
    throttleMs: 16 
  });
  
  // Default to 0 if undefined
  const progress = elementProgress || 0;

  return (
    <div style={{ minHeight: '300vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Sticky Scroll Demo</h1>
          <p>Scroll down to see the sticky animation</p>
          <div style={{ fontSize: '40px', marginTop: '20px' }}>↓</div>
        </div>
      </div>

      <div 
        ref={wrapperRef}
        style={{ height: '300vh', position: 'relative', background: '#e9ecef' }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h2 style={{ marginBottom: '20px' }}>Sticky Progress</h2>
            
            <div style={{
              width: '100%',
              height: '12px',
              background: '#f0f0f0',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}>
              <div style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2196f3, #9c27b0)',
                transition: 'width 0.1s linear',
              }} />
            </div>

            <div style={{ 
              fontSize: '60px', 
              fontWeight: 'bold', 
              fontVariantNumeric: 'tabular-nums',
              color: `hsl(${220 + progress * 80}, 70%, 50%)`
            }}>
              {Math.round(progress * 100)}%
            </div>
            
            <p style={{ marginTop: '20px', color: '#666', lineHeight: '1.6' }}>
              This element is <strong>sticky</strong>. The progress is calculated relative to its parent container's scroll position using <code>useScroll</code> inside this iframe.
            </p>
            
            <div style={{
              marginTop: '30px',
              display: 'flex',
              justifyContent: 'center',
              gap: '10px'
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: progress > (i * 0.33) ? '#2196f3' : '#ddd',
                  transform: progress > (i * 0.33) ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <p>End of demo</p>
      </div>
    </div>
  );
}

export const StickyScrollInIframe: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Sticky Scroll Animation in Iframe</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This example demonstrates using <code>useScroll</code> with a container ref inside an iframe to track 
        <strong>element-specific progress</strong> for sticky animations.
      </p>

      <IframePortal>
        {() => <StickyScrollIframeContent />}
      </IframePortal>
    </div>
  )
};

/**
 * Fill Text Reveal Animation in Iframe
 */
function FillTextIframeContent() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Track element progress in the sticky container
  const { elementProgress } = useScroll({ 
    container: wrapperRef,
    throttleMs: 16 
  });
  
  const progress = elementProgress || 0;
  
  const text = "Scroll to reveal this text character by character inside the iframe.";
  const words = text.split(" ");
  const totalChars = text.replace(/\s/g, '').length;
  let globalCharIndex = 0;

  return (
    <div style={{ minHeight: '300vh', fontFamily: 'system-ui, sans-serif' }}>
       {/* Spacer Top */}
      <div style={{ height: '50vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Fill Text Demo</h2>
          <p>Scroll down</p>
        </div>
      </div>

      {/* Sticky Section */}
      <div 
        ref={wrapperRef}
        style={{ height: '300vh', position: 'relative', background: '#000' }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}>
           <div style={{ 
             maxWidth: '800px', 
             textAlign: 'center',
             fontSize: '32px',
             fontWeight: 'bold',
             lineHeight: '1.6',
           }}>
             {words.map((word, wIndex) => (
                <span key={wIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {word.split('').map((char, cIndex) => {
                    const currentCharIndex = globalCharIndex++;
                    const charProgress = currentCharIndex / totalChars;
                    const transitionWidth = 0.05;
                    
                    let opacity: number;
                    if (progress > charProgress + transitionWidth) {
                       opacity = 1;
                    } else if (progress < charProgress - transitionWidth) {
                       opacity = 0.1;
                    } else {
                       const t = (progress - (charProgress - transitionWidth)) / (2 * transitionWidth);
                       opacity = 0.1 + (1 - 0.1) * t;
                    }

                    return (
                      <span
                        key={cIndex}
                        style={{
                           display: 'inline-block',
                           color: opacity > 0.5 ? '#fff' : '#fff',
                           opacity: opacity,
                           transition: 'opacity 0.1s ease-out'
                        }}
                      >
                        {char}
                      </span>
                    );
                  })}
                  {/* Space */}
                  {wIndex < words.length - 1 && <span style={{ display: 'inline-block', width: '0.3em' }}> </span>}
                </span>
             ))}
           </div>
        </div>
      </div>

      {/* Spacer Bottom */}
      <div style={{ height: '100vh', background: '#000', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>End of fill text demo</p>
      </div>
    </div>
  );
}

export const FillTextInIframe: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Fill Text Reveal in Iframe</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        This example demonstrates the JS-driven <strong>character-by-character text reveal</strong> effect working 
        inside an iframe, powered by the same <code>useScroll</code> logic.
      </p>

      <IframePortal>
        {() => <FillTextIframeContent />}
      </IframePortal>
    </div>
  )
};

/**
 * Direct createPortal Example
 * Shows explicit usage of createPortal + useIframe hook pattern
 */
function DirectPortalContent() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const { elementProgress } = useScroll({ 
    container: wrapperRef,
    throttleMs: 16 
  });
  
  const progress = elementProgress || 0;
  
  const sentences = [
    "This example uses createPortal directly.",
    "No wrapper component needed.",
    "Just the hook and the portal."
  ];
  
  return (
    <div style={{ 
      minHeight: '400vh', 
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Hero */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{ color: '#fff', fontSize: '48px', margin: 0, textAlign: 'center' }}>
          Direct createPortal
        </h1>
        <p style={{ color: '#888', fontSize: '18px', margin: 0 }}>
          Scroll to see the text reveal
        </p>
        <div style={{ fontSize: '32px', color: '#666', marginTop: '40px' }}>↓</div>
      </div>

      {/* Sticky Fill Text Section */}
      <div 
        ref={wrapperRef}
        style={{ height: '300vh', position: 'relative' }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}>
          <div style={{ 
            maxWidth: '700px', 
            textAlign: 'center',
          }}>
            {sentences.map((sentence, sIndex) => {
              const words = sentence.split(' ');
              const sentenceStart = sentences.slice(0, sIndex).join(' ').replace(/\s/g, '').length;
              const totalChars = sentences.join(' ').replace(/\s/g, '').length;
              let charOffset = sentenceStart;
              
              return (
                <p key={sIndex} style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  lineHeight: '1.6',
                  margin: '0 0 20px 0'
                }}>
                  {words.map((word, wIndex) => (
                    <span key={wIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                      {word.split('').map((char, cIndex) => {
                        const charProgress = charOffset / totalChars;
                        charOffset++;
                        const transitionWidth = 0.04;
                        
                        let opacity: number;
                        if (progress > charProgress + transitionWidth) {
                          opacity = 1;
                        } else if (progress < charProgress - transitionWidth) {
                          opacity = 0.15;
                        } else {
                          const t = (progress - (charProgress - transitionWidth)) / (2 * transitionWidth);
                          opacity = 0.15 + 0.85 * t;
                        }

                        return (
                          <span
                            key={cIndex}
                            style={{
                              display: 'inline-block',
                              color: `rgba(255, 255, 255, ${opacity})`,
                              transition: 'color 0.1s ease-out'
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
                      {wIndex < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
          
          {/* Progress indicator */}
          <div style={{
            marginTop: '40px',
            width: '200px',
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #e94560, #0f3460)',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p style={{ color: '#fff', fontSize: '24px', margin: 0 }}>✨ Complete</p>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Rendered via createPortal into iframe
        </p>
      </div>
    </div>
  );
}

export const CreatePortalExample: Story = {
  render: function CreatePortalStory() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
    const [iframeWindow, setIframeWindow] = useState<Window | null>(null);

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
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { overflow-x: hidden; }
            </style>
          </head>
          <body>
            <div id="portal-root"></div>
          </body>
        </html>
      `);
      doc.close();

      setIframeWindow(iframe.contentWindow);
      setMountNode(doc.getElementById('portal-root'));
    }, []);

    return (
      <div style={{ padding: '20px' }}>
        <h1>Direct createPortal Usage</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          This example shows how to use <code>createPortal</code> directly with an iframe, 
          without an abstraction layer. The portal renders content into the iframe's DOM.
        </p>

        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '13px',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0 }}>{`// Pattern:
const iframeRef = useRef<HTMLIFrameElement>(null);
const [mountNode, setMountNode] = useState(null);

// Setup iframe document...
setMountNode(doc.getElementById('portal-root'));

// Render with portal
{mountNode && createPortal(<Content />, mountNode)}`}</pre>
        </div>

        <iframe
          ref={iframeRef}
          style={{
            width: '100%',
            height: '600px',
            border: '2px solid #333',
            borderRadius: '12px',
          }}
        />
        
        {mountNode && iframeWindow && createPortal(
          <ResponsiveProvider targetWindow={iframeWindow}>
            <WindowSizeProvider targetWindow={iframeWindow}>
              <DirectPortalContent />
            </WindowSizeProvider>
          </ResponsiveProvider>,
          mountNode
        )}
      </div>
    );
  }
};
