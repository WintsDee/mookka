
import { useState, useCallback, useEffect } from "react";

export function useMediaTabs(initialTab: string = "critique") {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Ensure proper initialization on mount
  useEffect(() => {
    if (!isInitialized) {
      setActiveTab(initialTab);
      setIsInitialized(true);
    }
  }, [initialTab, isInitialized]);
  
  // Use a callback to prevent unnecessary re-renders when changing tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  
  return {
    activeTab,
    handleTabChange,
    isInitialized
  };
}
