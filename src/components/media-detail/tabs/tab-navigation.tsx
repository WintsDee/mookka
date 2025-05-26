
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { MediaTabTrigger } from "./tab-trigger";
import { useIsMobile } from "@/hooks/use-mobile";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className="grid grid-cols-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border rounded-none p-0 shadow-sm">
      <MediaTabTrigger 
        value="critique" 
        label="Critique"
        activeTab={activeTab}
        onClick={onTabChange}
      />
      <MediaTabTrigger 
        value="overview" 
        label="Aperçu"
        activeTab={activeTab}
        onClick={onTabChange}
      />
      <MediaTabTrigger 
        value="whereto" 
        label={isMobile ? "Voir/Acheter" : "Où voir/acheter"}
        activeTab={activeTab}
        onClick={onTabChange}
      />
      <MediaTabTrigger 
        value="progression" 
        label="Progression"
        activeTab={activeTab}
        onClick={onTabChange}
      />
    </TabsList>
  );
}
