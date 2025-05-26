
import { useState, useCallback } from "react";

export function useMediaTabs(initialTab: string = "critique") {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Use a callback to prevent unnecessary re-renders when changing tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  
  return {
    activeTab,
    handleTabChange
  };
}
