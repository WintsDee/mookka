
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { MediaType } from "@/types";
import { TabNavigation } from "./tabs/tab-navigation";
import { TabContentContainer } from "./tabs/tab-content-container";
import { useMediaTabs } from "./tabs/use-media-tabs";
import { TabContent } from "./tabs/tab-content";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  // Use our custom hook for tab state management
  const { activeTab, handleTabChange } = useMediaTabs();
  
  // Debug logging to track props
  console.log("MediaContent props:", { id, type, formattedMedia: !!formattedMedia, additionalInfo: !!additionalInfo });
  
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        <TabContentContainer>
          <TabContent 
            id={id} 
            type={type} 
            formattedMedia={formattedMedia} 
            additionalInfo={additionalInfo}
          />
        </TabContentContainer>
      </Tabs>
    </div>
  );
}
