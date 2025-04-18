
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HelpItem } from "./help-item";
import { NeedMoreHelp } from "./need-more-help";
import { helpItems, getHelpItemsByCategory } from "./data/help-items-data";

export function HelpItems() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const displayedItems = activeCategory === "all" 
    ? helpItems 
    : getHelpItemsByCategory(activeCategory);

  return (
    <ScrollArea className="max-h-[400px]">
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">Tout</TabsTrigger>
          <TabsTrigger value="usage" className="flex-1">Utilisation</TabsTrigger>
          <TabsTrigger value="collections" className="flex-1">Collections</TabsTrigger>
          <TabsTrigger value="social" className="flex-1">Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          <div className="space-y-4 pr-4">
            {displayedItems.map((item, index) => (
              <HelpItem 
                key={index} 
                title={item.title} 
                content={item.content} 
              />
            ))}
            <NeedMoreHelp />
          </div>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
