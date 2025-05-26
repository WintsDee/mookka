
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { TabNavigation } from "./tabs/tab-navigation";
import { TabContent } from "./tabs/tab-content";
import { MediaType } from "@/types";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  return (
    <div className="px-4 pb-20">
      <Tabs defaultValue="critique" className="w-full">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-30 py-4 border-b border-border/50">
          <TabNavigation type={type} defaultValue="critique" />
        </div>
        
        <TabContent 
          id={id} 
          type={type} 
          formattedMedia={formattedMedia} 
          additionalInfo={additionalInfo} 
        />
      </Tabs>
    </div>
  );
}
