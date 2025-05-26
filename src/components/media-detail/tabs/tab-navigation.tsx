
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaType } from "@/types";
import { TabTrigger } from "./tab-trigger";

interface TabNavigationProps {
  type: MediaType;
  defaultValue?: string;
}

export function TabNavigation({ type, defaultValue = "critique" }: TabNavigationProps) {
  const tabs = [
    { value: "critique", label: "Notes & Critiques", icon: "star" },
    { value: "overview", label: "Aperçu", icon: "info" },
    { value: "whereto", label: "Où regarder", icon: "eye" },
    { value: "progression", label: "Progression", icon: "progress" },
    { value: "collections", label: "Collections", icon: "folder" },
    { value: "news", label: "Actualités", icon: "newspaper" }
  ];

  return (
    <TabsList className="grid w-full grid-cols-3 gap-1 bg-muted/30 p-1 h-auto">
      {tabs.slice(0, 6).map((tab) => (
        <TabTrigger 
          key={tab.value}
          value={tab.value} 
          label={tab.label}
          icon={tab.icon}
          className="text-xs py-2 px-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
        />
      ))}
    </TabsList>
  );
}
