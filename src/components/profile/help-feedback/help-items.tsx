
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpItem } from "./help-item";
import { NeedMoreHelp } from "./need-more-help";

interface HelpItem {
  title: string;
  content: string;
}

interface HelpItemsProps {
  items: HelpItem[];
}

export function HelpItems({ items }: HelpItemsProps) {
  return (
    <ScrollArea className="max-h-[400px] pr-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <HelpItem key={index} title={item.title} content={item.content} />
        ))}
        
        <NeedMoreHelp />
      </div>
    </ScrollArea>
  );
}
