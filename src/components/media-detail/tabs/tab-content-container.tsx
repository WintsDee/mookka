
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TabContentContainerProps {
  children: React.ReactNode;
}

export function TabContentContainer({ children }: TabContentContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-28">
      <div className="px-4 py-4">
        {children}
      </div>
    </div>
  );
}
