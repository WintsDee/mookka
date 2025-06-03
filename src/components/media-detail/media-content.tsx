
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
  console.log("MediaContent: Rendering with props:", { id, type, hasFormattedMedia: !!formattedMedia });
  
  // Temporairement utiliser "overview" comme défaut au lieu de "critique"
  const { activeTab, handleTabChange, isInitialized } = useMediaTabs("overview");
  const [contentMounted, setContentMounted] = useState(false);
  
  useEffect(() => {
    console.log("MediaContent: Effect running with:", { id, type, formattedMedia: !!formattedMedia });
    
    if (!id || !type || !formattedMedia) {
      console.warn("MediaContent: Missing required props", { id, type, formattedMedia: !!formattedMedia });
      return;
    }
    
    const timer = setTimeout(() => {
      console.log("MediaContent: Setting content as mounted");
      setContentMounted(true);
    }, 100);
    
    return () => {
      console.log("MediaContent: Cleaning up timer");
      clearTimeout(timer);
    };
  }, [id, type, formattedMedia]);
  
  // Show loading state while data is being prepared
  if (!id || !type || !formattedMedia) {
    console.log("MediaContent: Showing loading state - missing props");
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
    console.log("MediaContent: Showing loading state - not initialized", { isInitialized, contentMounted });
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
  
  console.log("MediaContent: Rendering main content with activeTab:", activeTab);
  
  try {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="overview">
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
  } catch (error) {
    console.error("MediaContent: Error during render:", error);
    return (
      <div className="w-full h-full flex flex-col p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur de rendu:</strong> {error instanceof Error ? error.message : "Erreur inconnue"}
        </div>
      </div>
    );
  }
}
