import React, { useEffect, useRef } from 'react';

export default function Turnstile({ siteKey, onSuccess, onExpire }) {
  const containerRef = useRef(null);
  const isRenderedRef = useRef(false);

  useEffect(() => {
    if (!siteKey) return;
    isRenderedRef.current = false; // Reset on siteKey changes
    // 1. Check if Cloudflare Turnstile API script is loaded. If not, append it.
    if (!document.getElementById('cloudflare-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    let widgetId = null;

    // 2. Render function using the Turnstile explicit render API
    const renderWidget = () => {
      if (isRenderedRef.current) return;
      if (window.turnstile && containerRef.current) {
        try {
          isRenderedRef.current = true;
          // Explicitly render Turnstile in our container ref with interactive forced options
          widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: 'dark', // Render with dark mode styling to match our theme!
            appearance: 'always', // Always visibly display the checkbox
            execution: 'render',
            callback: (token) => {
              if (onSuccess) onSuccess(token);
            },
            'expired-callback': () => {
              if (onExpire) onExpire();
            },
            'error-callback': () => {
              console.error('[Turnstile] Challenge error occurred.');
            }
          });
        } catch (error) {
          console.error('[Turnstile Render Error]:', error);
        }
      }
    };

    // 3. If Turnstile is already loaded, render immediately. Otherwise, listen to callback
    if (window.turnstile) {
      renderWidget();
    } else {
      // Set a global callback that Turnstile calls once loaded
      window.onloadTurnstileCallback = renderWidget;
      
      // Fallback polling interval to check if script loaded and onload callback missed
      const interval = setInterval(() => {
        if (window.turnstile && containerRef.current) {
          renderWidget();
          clearInterval(interval);
        }
      }, 500);
      
      return () => clearInterval(interval);
    }

    // 4. Cleanup widget on unmount to prevent leaks
    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          // Ignore removal error on hot-reloading
        }
      }
    };
  }, [siteKey, onSuccess, onExpire]);

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 16,
        minHeight: '65px' 
      }}
    >
      <div ref={containerRef} />
    </div>
  );
}
