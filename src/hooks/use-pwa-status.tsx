
import { useState, useEffect } from "react"
import { useIsMobile } from "./use-mobile"

export function usePWAStatus() {
  const [isPWA, setIsPWA] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://')
    
    setIsPWA(isStandalone)
    
    // Also add an event listener for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [])

  // Only show install prompt on mobile when not already in PWA mode
  return {
    isPWA,
    shouldShowInstallPrompt: isMobile && !isPWA
  }
}
