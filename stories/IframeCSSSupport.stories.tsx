import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { Element } from '../src/element/Element';
import { ResponsiveProvider } from '../src/providers/Responsive';
import { WindowSizeProvider } from '../src/providers/WindowSize';
import { ThemeProvider } from '../src/providers/Theme';
import { useStyleRegistry } from '../src/providers/StyleRegistry';

const meta: Meta = {
  title: 'Core/Iframe CSS Support',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

/**
 * Simple iframe portal component
 */
interface IframePortalProps {
  children: ReactNode | ((iframWindow: Window) => ReactNode);
  title?: string;
}

function IframePortal({ children, title = 'Iframe Content' }: IframePortalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const { manager } = useStyleRegistry();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const iframeDoc = iframe.contentWindow.document;
    
    // Write the HTML content
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // IMPORTANT: Register the iframe document with the style manager
    // AFTER writing the HTML content to avoid wiping out injected styles
    manager.addDocument(iframeDoc);

    setIframeWindow(iframe.contentWindow);
    setMountNode(iframeDoc.getElementById('root'));

    // Cleanup: remove document from manager when unmounting
    return () => {
      manager.removeDocument(iframeDoc);
    };
  }, [title, manager]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        style={{
          width: '100%',
          height: '600px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
        }}
      />
      {mountNode && iframeWindow && createPortal(
        <ThemeProvider targetWindow={iframeWindow}>
          <ResponsiveProvider targetWindow={iframeWindow}>
            <WindowSizeProvider targetWindow={iframeWindow}>
              {typeof children === 'function' ? children(iframeWindow) : children}
            </WindowSizeProvider>
          </ResponsiveProvider>
        </ThemeProvider>,
        mountNode
      )}
    </>
  );
}

/**
 * Basic CSS utility classes in iframe
 */
export const BasicUtilityClasses: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Basic CSS Utility Classes in Iframe</h1>
      <p>All app-studio utility classes are automatically injected into the iframe document.</p>

      <IframePortal title="Basic Utilities Demo">
        <Element padding={20}>
          <Element
            as="h2"
            color="color.blue.500"
            fontSize={24}
            marginBottom={16}
          >
            Welcome to Iframe Styling! 🎨
          </Element>

          <Element
            background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            padding={20}
            borderRadius={12}
            marginBottom={16}
          >
            <Element as="h3" fontSize={20} marginBottom={8}>
              Gradient Background
            </Element>
            <Element>
              This element uses utility classes for gradient, padding, and border radius.
            </Element>
          </Element>

          <Element display="flex" gap={16} flexWrap="wrap">
            <Element
              backgroundColor="color.red.500"
              color="white"
              padding={16}
              borderRadius={8}
              flex={1}
              minWidth={150}
            >
              Red Box
            </Element>
            <Element
              backgroundColor="color.green.500"
              color="white"
              padding={16}
              borderRadius={8}
              flex={1}
              minWidth={150}
            >
              Green Box
            </Element>
            <Element
              backgroundColor="color.blue.500"
              color="white"
              padding={16}
              borderRadius={8}
              flex={1}
              minWidth={150}
            >
              Blue Box
            </Element>
          </Element>
        </Element>
      </IframePortal>

      <Element marginTop={20} padding={20} backgroundColor="#f9f9f9" borderRadius={8}>
        <Element as="h3" marginBottom={10}>✅ What's Working:</Element>
        <ul>
          <li>All utility classes (padding, margin, colors, etc.)</li>
          <li>Theme colors (color.* references)</li>
          <li>Layout utilities (flexbox, grid)</li>
          <li>Automatic style injection into iframe</li>
        </ul>
      </Element>
    </div>
  ),
};

/**
 * Pseudo-classes and states
 */
export const PseudoClassesAndStates: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Pseudo-Classes & Interactive States</h1>
      <p>Hover, focus, and other pseudo-classes work seamlessly in iframes.</p>

      <IframePortal title="Pseudo-Classes Demo">
        <Element padding={20}>
          <Element as="h2" marginBottom={20} fontSize={24} color="color.purple.600">
            Interactive Elements
          </Element>

          <Element display="flex" flexDirection="column" gap={16}>
            {/* Hover effects */}
            <Element
              as="button"
              padding={16}
              backgroundColor="color.blue.500"
              color="white"
              border="none"
              borderRadius={8}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                backgroundColor: 'color.blue.700',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              Hover Me! 👆
            </Element>

            {/* Focus effects */}
            <Element
              as="input"
              type="text"
              placeholder="Focus me to see the effect"
              padding={12}
              border="2px solid #ddd"
              borderRadius={8}
              fontSize={16}
              outline="none"
              _focus={{
                borderColor: 'color.purple.500',
                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
              }}
            />

            {/* Active state */}
            <Element
              as="button"
              padding={16}
              backgroundColor="color.green.500"
              color="white"
              border="none"
              borderRadius={8}
              cursor="pointer"
              _active={{
                backgroundColor: 'color.green.700',
                transform: 'scale(0.98)',
              }}
            >
              Click Me! (Active State)
            </Element>

            {/* Group hover */}
            <Element
              className="group"
              padding={16}
              border="2px solid #ddd"
              borderRadius={8}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                borderColor: 'color.indigo.500',
                backgroundColor: '#f8f9fa',
              }}
            >
              <Element
                fontSize={18}
                fontWeight="bold"
                marginBottom={8}
                color="color.gray.700"
                transition="color 0.3s ease"
                _groupHover={{
                  color: 'color.indigo.600',
                }}
              >
                Group Hover Example
              </Element>
              <Element color="color.gray.600">
                Hover over this card to see the title change color
              </Element>
            </Element>
          </Element>
        </Element>
      </IframePortal>
    </div>
  ),
};

/**
 * Animations in iframe
 */
export const AnimationsInIframe: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Animations & Keyframes</h1>
      <p>CSS animations and keyframes are properly injected into iframe documents.</p>

      <IframePortal title="Animations Demo">
        <Element padding={20}>
          <Element as="h2" marginBottom={20} fontSize={24}>
            Animated Elements
          </Element>

          <Element display="flex" flexDirection="column" gap={20}>
            {/* Fade in animation */}
            <Element
              padding={20}
              backgroundColor="color.pink.100"
              borderRadius={8}
              animate={{
                from: { opacity: 0, transform: 'translateY(-20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
                duration: '1s',
                timingFunction: 'ease-out',
              }}
            >
              <Element fontWeight="bold" marginBottom={8}>
                Fade In Animation
              </Element>
              <Element>This element fades in from top</Element>
            </Element>

            {/* Scale animation on hover */}
            <Element
              padding={20}
              backgroundColor="color.cyan.100"
              borderRadius={8}
              cursor="pointer"
              transition="transform 0.3s ease"
              _hover={{
                transform: 'scale(1.05)',
              }}
            >
              <Element fontWeight="bold" marginBottom={8}>
                Hover to Scale
              </Element>
              <Element>Hover over this card to see it grow</Element>
            </Element>

            {/* Pulse animation */}
            <Element
              padding={20}
              backgroundColor="color.yellow.100"
              borderRadius={8}
              animate={{
                from: { transform: 'scale(1)' },
                to: { transform: 'scale(1.02)' },
                duration: '1s',
                timingFunction: 'ease-in-out',
                iterationCount: 'infinite',
                direction: 'alternate',
              }}
            >
              <Element fontWeight="bold" marginBottom={8}>
                Pulsing Animation
              </Element>
              <Element>This card gently pulses forever</Element>
            </Element>
          </Element>
        </Element>
      </IframePortal>
    </div>
  ),
};

/**
 * Responsive styles in iframe
 */
export const ResponsiveStyles: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Responsive Styles in Iframe</h1>
      <p>Media queries and responsive utilities work with iframe context.</p>

      <IframePortal title="Responsive Demo">
        <Element padding={20}>
          <Element as="h2" marginBottom={20} fontSize={24}>
            Resize the iframe to see changes
          </Element>

          <Element
            media={{
              xs: { backgroundColor: 'color.red.200', padding: 10 },
              sm: { backgroundColor: 'color.orange.200', padding: 15 },
              md: { backgroundColor: 'color.yellow.200', padding: 20 },
              lg: { backgroundColor: 'color.green.200', padding: 25 },
              xl: { backgroundColor: 'color.blue.200', padding: 30 },
            }}
            borderRadius={8}
            marginBottom={20}
          >
            <Element fontWeight="bold" marginBottom={8}>
              Responsive Background & Padding
            </Element>
            <Element>
              The background color and padding change based on breakpoints:
            </Element>
            <ul style={{ marginTop: 8 }}>
              <li>xs (0-340px): Red, 10px padding</li>
              <li>sm (340-560px): Orange, 15px padding</li>
              <li>md (560-1080px): Yellow, 20px padding</li>
              <li>lg (1080-1300px): Green, 25px padding</li>
              <li>xl (1300px+): Blue, 30px padding</li>
            </ul>
          </Element>

          <Element
            display="grid"
            media={{
              xs: { gridTemplateColumns: '1fr' },
              md: { gridTemplateColumns: '1fr 1fr' },
              lg: { gridTemplateColumns: '1fr 1fr 1fr' },
            }}
            gap={16}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Element
                key={i}
                padding={20}
                backgroundColor="color.purple.100"
                borderRadius={8}
                textAlign="center"
              >
                Card {i}
              </Element>
            ))}
          </Element>
        </Element>
      </IframePortal>
    </div>
  ),
};

/**
 * Multiple iframes with independent styles
 */
export const MultipleIframes: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Multiple Iframes with Independent Styles</h1>
      <p>Each iframe gets its own copy of all CSS rules.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>Iframe 1 - Blue Theme</h3>
          <IframePortal title="Blue Theme">
            {(iframeWindow) => (
              <ThemeProvider 
                theme={{ primary: 'color.blue.500', secondary: 'color.cyan.500' }}
                targetWindow={iframeWindow}
              >
                <Element padding={20}>
                  <Element
                    as="h3"
                    color="theme.primary"
                    fontSize={20}
                    marginBottom={16}
                  >
                    Blue Theme Iframe
                  </Element>
                  <Element
                    padding={16}
                    backgroundColor="theme.primary"
                    color="white"
                    borderRadius={8}
                    marginBottom={12}
                  >
                    Primary Color Box
                  </Element>
                  <Element
                    padding={16}
                    backgroundColor="theme.secondary"
                    color="white"
                    borderRadius={8}
                  >
                    Secondary Color Box
                  </Element>
                </Element>
              </ThemeProvider>
            )}
          </IframePortal>
        </div>

        <div>
          <h3>Iframe 2 - Purple Theme</h3>
          <IframePortal title="Purple Theme">
            {(iframeWindow) => (
              <ThemeProvider 
                theme={{ primary: 'color.purple.500', secondary: 'color.pink.500' }}
                targetWindow={iframeWindow}
              >
                <Element padding={20}>
                  <Element
                    as="h3"
                    color="theme.primary"
                    fontSize={20}
                    marginBottom={16}
                  >
                    Purple Theme Iframe
                  </Element>
                  <Element
                    padding={16}
                    backgroundColor="theme.primary"
                    color="white"
                    borderRadius={8}
                    marginBottom={12}
                  >
                    Primary Color Box
                  </Element>
                  <Element
                    padding={16}
                    backgroundColor="theme.secondary"
                    color="white"
                    borderRadius={8}
                  >
                    Secondary Color Box
                  </Element>
                </Element>
              </ThemeProvider>
            )}
          </IframePortal>
        </div>
      </div>

      <Element marginTop={20} padding={20} backgroundColor="#f0f7ff" borderRadius={8}>
        <Element as="h3" marginBottom={10}>💡 Key Points:</Element>
        <ul>
          <li>Each iframe maintains its own stylesheet</li>
          <li>Styles are automatically synchronized</li>
          <li>Themes can be different per iframe</li>
          <li>No style conflicts between iframes</li>
        </ul>
      </Element>
    </div>
  ),
};

/**
 * Complex nested components
 */
export const ComplexComponents: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h1>Complex Nested Components</h1>
      <p>Testing complex component hierarchies with various styling utilities.</p>

      <IframePortal title="Complex Demo">
        <Element padding={20} minHeight="100vh" backgroundColor="#f5f5f5">
          {/* Header */}
          <Element
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={20}
            backgroundColor="white"
            boxShadow="0 2px 8px rgba(0,0,0,0.1)"
            borderRadius={12}
            marginBottom={20}
          >
            <Element fontSize={24} fontWeight="bold" color="color.indigo.600">
              App Studio Iframe
            </Element>
            <Element display="flex" gap={12}>
              <Element
                as="button"
                padding="8px 16px"
                backgroundColor="color.indigo.500"
                color="white"
                border="none"
                borderRadius={6}
                cursor="pointer"
                _hover={{ backgroundColor: 'color.indigo.600' }}
              >
                Action 1
              </Element>
              <Element
                as="button"
                padding="8px 16px"
                backgroundColor="color.gray.200"
                color="color.gray.700"
                border="none"
                borderRadius={6}
                cursor="pointer"
                _hover={{ backgroundColor: 'color.gray.300' }}
              >
                Action 2
              </Element>
            </Element>
          </Element>

          {/* Grid of cards */}
          <Element
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={16}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Element
                key={i}
                backgroundColor="white"
                padding={20}
                borderRadius={12}
                boxShadow="0 1px 3px rgba(0,0,0,0.1)"
                transition="all 0.3s ease"
                cursor="pointer"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                }}
              >
                <Element
                  width={40}
                  height={40}
                  borderRadius={8}
                  backgroundColor={`color.${['blue', 'purple', 'pink', 'green', 'orange', 'cyan'][i]}.500`}
                  marginBottom={12}
                />
                <Element fontSize={18} fontWeight="bold" marginBottom={8}>
                  Card {i + 1}
                </Element>
                <Element color="color.gray.600" fontSize={14}>
                  This is a card with hover effects
                </Element>
              </Element>
            ))}
          </Element>
        </Element>
      </IframePortal>
    </div>
  ),
};
