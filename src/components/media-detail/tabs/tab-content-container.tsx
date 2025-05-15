
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TabContentContainerProps {
  children: React.ReactNode;
}

export function TabContentContainer({ children }: TabContentContainerProps) {
  return (
    <ScrollArea className="flex-1 overflow-auto">
      <div className="px-4 py-4 pb-28">
        {children}
      </div>
    </ScrollArea>
  );
}
