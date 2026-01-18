import { useEffect, useRef, useState } from 'react';
import { useStyleRegistry } from '../providers/StyleRegistry';

/**
 * Hook to register an iframe's document with the style manager.
 * This ensures that all CSS utility classes are automatically injected into the iframe.
 *
 * @param iframeRef - Reference to the iframe element
 *
 * @example
 * ```tsx
 * const iframeRef = useRef<HTMLIFrameElement>(null);
 * useIframeStyles(iframeRef);
 *
 * return <iframe ref={iframeRef} src="/content" />;
 * ```
 */
export function useIframeStyles(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const { manager } = useStyleRegistry();
  const registeredDocRef = useRef<Document | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const registerDocument = () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Only register if not already registered
      if (registeredDocRef.current !== iframeDoc) {
        manager.addDocument(iframeDoc);
        registeredDocRef.current = iframeDoc;
      }
    };

    // Try to register immediately if document is ready
    if (iframe.contentDocument) {
      registerDocument();
    }

    // Also register on load event (for external sources)
    iframe.addEventListener('load', registerDocument);

    return () => {
      iframe.removeEventListener('load', registerDocument);

      // Clean up when unmounting
      if (registeredDocRef.current) {
        manager.removeDocument(registeredDocRef.current);
        registeredDocRef.current = null;
      }
    };
  }, [manager, iframeRef]);
}

/**
 * Hook to get an iframe's window and document, and automatically register styles.
 * This is a convenience hook that combines iframe access with style registration.
 *
 * @param iframeRef - Reference to the iframe element
 * @returns Object containing iframeWindow, iframeDocument, and isLoaded flag
 *
 * @example
 * ```tsx
 * const iframeRef = useRef<HTMLIFrameElement>(null);
 * const { iframeWindow, iframeDocument, isLoaded } = useIframe(iframeRef);
 *
 * return (
 *   <>
 *     <iframe ref={iframeRef} src="/content" />
 *     {isLoaded && <div>Iframe loaded!</div>}
 *   </>
 * );
 * ```
 */
export function useIframe(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Register styles
  useIframeStyles(iframeRef);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const updateState = () => {
      const win = iframe.contentWindow;
      const doc = win?.document || iframe.contentDocument;

      if (win && doc) {
        setIframeWindow(win);
        setIframeDocument(doc);
        setIsLoaded(true);
      }
    };

    // Try immediately
    updateState();

    // Listen for load event
    iframe.addEventListener('load', updateState);

    return () => {
      iframe.removeEventListener('load', updateState);
    };
  }, [iframeRef]);

  return {
    iframeWindow,
    iframeDocument,
    isLoaded,
  };
}
