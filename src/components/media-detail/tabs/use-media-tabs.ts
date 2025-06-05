
import { useState, useCallback, useEffect, useRef } from "react";

export function useMediaTabs(initialTab: string = "overview") {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!mountedRef.current) return;
    
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setActiveTab("overview");
        setIsInitialized(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Listener pour la navigation personnalisée vers l'onglet critique
  useEffect(() => {
    const handleSwitchToCritique = (event: CustomEvent) => {
      if (event.detail?.targetTab === 'critique' && mountedRef.current) {
        console.log('Navigation vers l\'onglet critique détectée');
        setActiveTab('critique');
      }
    };

    document.addEventListener('switchToCritique', handleSwitchToCritique as EventListener);
    
    return () => {
      document.removeEventListener('switchToCritique', handleSwitchToCritique as EventListener);
    };
  }, []);
  
  const handleTabChange = useCallback((value: string) => {
    if (!mountedRef.current) return;
    
    try {
      console.log('Changement d\'onglet vers:', value);
      setActiveTab(value);
    } catch (error) {
      console.error("Erreur lors du changement d'onglet:", error);
      setActiveTab("overview");
    }
  }, []);
  
  return {
    activeTab,
    handleTabChange,
    isInitialized
  };
}
