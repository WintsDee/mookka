
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
  }, [])

  // Only show install prompt on mobile
  return {
    shouldShowInstallPrompt: isMobile && !isPWA
  }
}
