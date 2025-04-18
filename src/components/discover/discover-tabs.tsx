
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaType } from "@/types";

export type TabType = MediaType | 'all';

interface DiscoverTabsProps {
  activeTab: TabType;
  onTabChange: (value: TabType) => void;
}

export function DiscoverTabs({ activeTab, onTabChange }: DiscoverTabsProps) {
  const handleValueChange = (value: string) => {
    onTabChange(value as TabType);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleValueChange} className="w-full">
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
        <TabsTrigger value="film" className="text-xs">Films</TabsTrigger>
        <TabsTrigger value="serie" className="text-xs">Séries</TabsTrigger>
        <TabsTrigger value="book" className="text-xs">Livres</TabsTrigger>
        <TabsTrigger value="game" className="text-xs">Jeux</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
