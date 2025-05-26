
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaType } from "@/types";
import { Star, Info, Eye, BarChart3, Folder, Newspaper } from "lucide-react";

interface TabNavigationProps {
  type: MediaType;
  defaultValue?: string;
}

export function TabNavigation({ type, defaultValue = "critique" }: TabNavigationProps) {
  const tabs = [
    { value: "critique", label: "Notes & Critiques", icon: Star },
    { value: "overview", label: "Aperçu", icon: Info },
    { value: "whereto", label: "Où regarder", icon: Eye },
    { value: "progression", label: "Progression", icon: BarChart3 },
    { value: "collections", label: "Collections", icon: Folder },
    { value: "news", label: "Actualités", icon: Newspaper }
  ];

  return (
    <TabsList className="grid w-full grid-cols-3 gap-1 bg-muted/30 p-1 h-auto">
      {tabs.slice(0, 6).map((tab) => {
        const IconComponent = tab.icon;
        return (
          <TabsTrigger 
            key={tab.value}
            value={tab.value}
            className="text-xs py-2 px-1 data-[state=active]:bg-background data-[state=active]:text-foreground flex flex-col items-center gap-1"
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-[10px] leading-tight text-center">{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
