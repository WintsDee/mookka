
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type BrowserType = "chrome" | "safari" | "firefox" | "samsung" | "opera" | "other";

export function usePwaInstall() {
  const isMobile = useIsMobile();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [browserType, setBrowserType] = useState<BrowserType>("other");

  // Détecter si l'app est déjà installée
  useEffect(() => {
    // Vérifier si l'application est déjà installée via matchMedia
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);

    // Détecter le type de navigateur
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome") || userAgent.includes("chromium")) {
      setBrowserType("chrome");
    } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      setBrowserType("safari");
    } else if (userAgent.includes("firefox")) {
      setBrowserType("firefox");
    } else if (userAgent.includes("samsungbrowser")) {
      setBrowserType("samsung");
    } else if (userAgent.includes("opera") || userAgent.includes("opr")) {
      setBrowserType("opera");
    } else {
      setBrowserType("other");
    }
  }, []);

  // Capturer l'événement beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome 67+ d'afficher automatiquement la bannière d'installation
      e.preventDefault();
      // Stocker l'événement pour pouvoir le déclencher plus tard
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Attendre un peu avant d'afficher notre propre prompt
      // pour ne pas surcharger l'utilisateur dès son arrivée
      setTimeout(() => {
        if (!isInstalled && isMobile) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isInstalled, isMobile]);

  // Fonction pour déclencher l'installation
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;
    
    try {
      // Afficher le prompt d'installation
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const choiceResult = await deferredPrompt.userChoice;
      
      // L'utilisateur a accepté l'installation
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
        return true;
      } else {
        // L'utilisateur a refusé
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation', error);
      return false;
    }
  }, [deferredPrompt]);

  // Fonction pour masquer le prompt
  const hideInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
  }, []);

  return {
    isInstalled,
    canInstallDirectly: !!deferredPrompt,
    showInstallPrompt,
    browserType,
    installApp,
    hideInstallPrompt,
    isMobile
  };
}
