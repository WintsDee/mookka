
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Sparkles, Newspaper, Zap } from "lucide-react";

interface DiscoverTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DiscoverTabs({ activeTab, onTabChange }: DiscoverTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 h-auto p-1 bg-background/60 backdrop-blur-sm">
        <TabsTrigger 
          value="trending" 
          className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary"
        >
          <Zap className="h-4 w-4" />
          <span className="text-xs">Tendances</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="nouveautes" 
          className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs">Nouveautés</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="recommandations" 
          className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary"
        >
          <Compass className="h-4 w-4" />
          <span className="text-xs">Pour vous</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="actualites" 
          className="flex flex-col items-center gap-1 py-2 data-[state=active]:text-primary"
        >
          <Newspaper className="h-4 w-4" />
          <span className="text-xs">Actualités</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
