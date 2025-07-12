import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/supabase/context'
import { Toaster } from '@/components/ui/toaster'
import AuthErrorHandler from '@/components/auth-error-handler'

export const metadata: Metadata = {
  title: 'Tensorus: Agentic Tensor Database',
  description: 'A revolutionary way to store and use information powered by AI agents',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Universal browser compatibility: Remove fetchpriority attribute
              (function() {
                // Check if fetchpriority is supported
                var testLink = document.createElement('link');
                var fetchPrioritySupported = 'fetchPriority' in testLink;
                
                if (!fetchPrioritySupported) {
                  // Remove fetchpriority from existing links
                  function removeFetchPriority() {
                    var links = document.querySelectorAll('link[fetchpriority], script[fetchpriority]');
                    for (var i = 0; i < links.length; i++) {
                      links[i].removeAttribute('fetchpriority');
                    }
                  }
                  
                  // Remove on DOM ready
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', removeFetchPriority);
                  } else {
                    removeFetchPriority();
                  }
                  
                  // Also observe for new elements being added
                  if (typeof MutationObserver !== 'undefined') {
                    var observer = new MutationObserver(function(mutations) {
                      mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                          for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i];
                            if (node.nodeType === 1) { // Element node
                              if ((node.tagName === 'LINK' || node.tagName === 'SCRIPT') && node.hasAttribute('fetchpriority')) {
                                node.removeAttribute('fetchpriority');
                              }
                              // Check children
                              var children = node.querySelectorAll && node.querySelectorAll('link[fetchpriority], script[fetchpriority]');
                              if (children) {
                                for (var j = 0; j < children.length; j++) {
                                  children[j].removeAttribute('fetchpriority');
                                }
                              }
                            }
                          }
                        }
                      });
                    });
                    observer.observe(document.head, { childList: true, subtree: true });
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <AuthErrorHandler />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
