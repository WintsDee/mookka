
import React, { useState, useEffect } from "react";
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
  const [contentMounted, setContentMounted] = useState(false);
  
  // Use effect to ensure proper mounting of tab content
  useEffect(() => {
    const timeout = setTimeout(() => {
      setContentMounted(true);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (!formattedMedia) {
    return null;
  }
  
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="overview">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        {contentMounted && (
          <TabContentContainer>
            <TabContent 
              id={id} 
              type={type} 
              formattedMedia={formattedMedia} 
              additionalInfo={additionalInfo}
            />
          </TabContentContainer>
        )}
      </Tabs>
    </div>
  );
}
