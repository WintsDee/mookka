
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

    // Listener pour les autres onglets
    const handleSwitchToTab = (event: CustomEvent) => {
      if (event.detail?.targetTab && mountedRef.current) {
        console.log(`Navigation vers l'onglet ${event.detail.targetTab} détectée`);
        setActiveTab(event.detail.targetTab);
      }
    };

    document.addEventListener('switchToCritique', handleSwitchToCritique as EventListener);
    document.addEventListener('switchToTab', handleSwitchToTab as EventListener);
    
    return () => {
      document.removeEventListener('switchToCritique', handleSwitchToCritique as EventListener);
      document.removeEventListener('switchToTab', handleSwitchToTab as EventListener);
    };
  }, []);
  
  const handleTabChange = useCallback((value: string) => {
    if (!mountedRef.current) return;
    
    try {
      console.log('Changement d\'onglet vers:', value);
      setActiveTab(value);
      
      // Dispatch un événement pour notifier le changement d'onglet
      const tabChangeEvent = new CustomEvent('tabChanged', { 
        detail: { activeTab: value },
        bubbles: true 
      });
      document.dispatchEvent(tabChangeEvent);
    } catch (error) {
      console.error("Erreur lors du changement d'onglet:", error);
      setActiveTab("overview");
    }
  }, []);

  // Fonction pour naviguer vers un onglet spécifique depuis l'extérieur
  const navigateToTab = useCallback((tabName: string) => {
    const event = new CustomEvent('switchToTab', { 
      detail: { targetTab: tabName },
      bubbles: true 
    });
    document.dispatchEvent(event);
  }, []);
  
  return {
    activeTab,
    handleTabChange,
    isInitialized,
    navigateToTab
  };
}
