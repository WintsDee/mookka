
import { useState, useCallback, useEffect } from "react";

export function useMediaTabs(initialTab: string = "overview") {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isInitialized, setIsInitialized] = useState(false);
  
  console.log("useMediaTabs: Initializing with tab:", initialTab);
  
  useEffect(() => {
    console.log("useMediaTabs: Setting up with initialTab:", initialTab);
    
    // Temporairement, forcer l'onglet "overview" pour débugger
    const safeTab = "overview"; // Changé de initialTab à "overview"
    console.log("useMediaTabs: Using safe tab:", safeTab);
    
    setActiveTab(safeTab);
    setIsInitialized(true);
    
    console.log("useMediaTabs: Initialization complete, activeTab:", safeTab);
  }, [initialTab]);
  
  const handleTabChange = useCallback((value: string) => {
    console.log("useMediaTabs: Changing tab from", activeTab, "to", value);
    setActiveTab(value);
  }, [activeTab]);
  
  return {
    activeTab,
    handleTabChange,
    isInitialized
  };
}
