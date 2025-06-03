
import { useState, useCallback, useEffect, useRef } from "react";

export function useMediaTabs(initialTab: string = "overview") {
  const [activeTab, setActiveTab] = useState("overview"); // Toujours commencer par overview pour éviter les bugs
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!mountedRef.current) return;
    
    // Utiliser un délai minimal pour s'assurer que tous les composants sont montés
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setActiveTab("overview"); // Forcer overview comme onglet initial stable
        setIsInitialized(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = useCallback((value: string) => {
    if (!mountedRef.current) return;
    
    try {
      setActiveTab(value);
    } catch (error) {
      console.error("Error changing tab:", error);
      // Fallback vers overview en cas d'erreur
      setActiveTab("overview");
    }
  }, []);
  
  return {
    activeTab,
    handleTabChange,
    isInitialized
  };
}
