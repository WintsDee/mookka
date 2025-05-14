
import React, { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/media-detail/tabs/overview-tab";
import { CritiqueTab } from "@/components/media-detail/tabs/rating-tab";
import { ProgressionTab } from "@/components/media-detail/tabs/progression";
import { WhereToWatchTab } from "@/components/media-detail/tabs/where-to-watch";
import { MediaType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  // Debug logging to track props
  console.log("MediaContent props:", { id, type, formattedMedia: !!formattedMedia, additionalInfo: !!additionalInfo });
  
  // Use a callback to prevent unnecessary re-renders when changing tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Memoize the tab content to prevent unnecessary re-renders
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab 
            description={formattedMedia?.description || ""} 
            additionalInfo={additionalInfo} 
            mediaId={id}
            mediaType={type}
          />
        );
      case "critique":
        return (
          <CritiqueTab 
            mediaId={id} 
            mediaType={type} 
            initialRating={formattedMedia?.userRating}
            initialReview={formattedMedia?.userReview}
          />
        );
      case "whereto":
        return (
          <WhereToWatchTab 
            mediaId={id} 
            mediaType={type} 
            title={formattedMedia?.title || ""}
          />
        );
      case "progression":
        return (
          <ProgressionTab 
            mediaId={id} 
            mediaType={type} 
            mediaDetails={additionalInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <TabsList className="grid grid-cols-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border rounded-none p-0 shadow-sm">
        <TabsTrigger 
          value="overview" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          onClick={() => handleTabChange("overview")}
          data-state={activeTab === "overview" ? "active" : "inactive"}
        >
          Aperçu
        </TabsTrigger>
        <TabsTrigger 
          value="critique" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          onClick={() => handleTabChange("critique")}
          data-state={activeTab === "critique" ? "active" : "inactive"}
        >
          Critique
        </TabsTrigger>
        <TabsTrigger 
          value="whereto" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          onClick={() => handleTabChange("whereto")}
          data-state={activeTab === "whereto" ? "active" : "inactive"}
        >
          {isMobile ? "Voir/Acheter" : "Où voir/acheter"}
        </TabsTrigger>
        <TabsTrigger 
          value="progression" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          onClick={() => handleTabChange("progression")}
          data-state={activeTab === "progression" ? "active" : "inactive"}
        >
          Progression
        </TabsTrigger>
      </TabsList>
      
      <ScrollArea className="flex-1 overflow-auto">
        <div className="px-4 py-4 pb-28">
          {renderTabContent()}
        </div>
      </ScrollArea>
    </div>
  );
}
