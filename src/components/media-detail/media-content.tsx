
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { MediaType } from "@/types";
import { TabNavigation } from "./tabs/tab-navigation";
import { TabContentContainer } from "./tabs/tab-content-container";
import { useMediaTabs } from "./tabs/use-media-tabs";
import { TabContent } from "./tabs/tab-content";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  const { activeTab, handleTabChange, isInitialized } = useMediaTabs("critique");
  const [contentMounted, setContentMounted] = useState(false);
  
  // Improved mounting strategy with error handling
  useEffect(() => {
    if (!id || !type || !formattedMedia) {
      console.log("MediaContent: Missing required props", { id, type, formattedMedia: !!formattedMedia });
      return;
    }
    
    // Ensure content is mounted only when all data is available
    const timer = setTimeout(() => {
      setContentMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id, type, formattedMedia]);
  
  // Show loading state while data is being prepared
  if (!id || !type || !formattedMedia) {
    return (
      <div className="w-full h-full flex flex-col p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-3/4" />
        </div>
      </div>
    );
  }
  
  // Show loading state while tabs initialize
  if (!isInitialized || !contentMounted) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="h-12 bg-muted animate-pulse rounded-t" />
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-3/4" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="critique">
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
