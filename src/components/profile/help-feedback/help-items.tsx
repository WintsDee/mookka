
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpItem } from "./help-item";
import { NeedMoreHelp } from "./need-more-help";
import { helpSections } from "@/components/settings/data/help-section-data";

export function HelpItems() {
  // Get the most common help items (first item from each section)
  const commonHelpItems = helpSections.map(section => section.items[0]);
  
  return (
    <ScrollArea className="max-h-[400px] pr-4">
      <div className="space-y-4">
        {commonHelpItems.map((item, index) => (
          <HelpItem key={index} title={item.question} content={item.answer} />
        ))}
        
        <NeedMoreHelp />
      </div>
    </ScrollArea>
  );
}
