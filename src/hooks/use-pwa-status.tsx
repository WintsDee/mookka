
import { useState, useEffect } from "react"
import { useIsMobile } from "./use-mobile"

export function usePWAStatus() {
  const [isPWA, setIsPWA] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://')
    
    setIsPWA(isStandalone)
    
    // Apply specific styles for PWA mode to enhance native feel
    if (isStandalone) {
      document.documentElement.classList.add('pwa-mode');
      
      // Add CSS variables for smooth transitions
      document.documentElement.style.setProperty('--page-transition-duration', '300ms');
      
      // Apply overscroll behavior
      document.body.style.overscrollBehavior = 'none';
      
      // Enable scrolling in PWA mode but prevent pull-to-refresh
      document.body.style.overflow = 'auto';
      document.body.style.height = '100%';
      document.body.style.position = 'relative';
    }
    
    setIsLoaded(true);
    
    // Also add an event listener for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('pwa-mode');
      } else {
        document.documentElement.classList.remove('pwa-mode');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [])

  // Only show install prompt on mobile when not already in PWA mode
  return {
    isPWA,
    isLoaded,
    shouldShowInstallPrompt: isMobile && !isPWA && isLoaded
  }
}
