
import React from "react";
import { TabsTrigger } from "@/components/ui/tabs";

interface TabTriggerProps {
  value: string;
  label: string;
  activeTab: string;
  onClick: (value: string) => void;
}

export function MediaTabTrigger({ value, label, activeTab, onClick }: TabTriggerProps) {
  return (
    <TabsTrigger 
      value={value} 
      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
      onClick={() => onClick(value)}
      data-state={activeTab === value ? "active" : "inactive"}
    >
      {label}
    </TabsTrigger>
  );
}
