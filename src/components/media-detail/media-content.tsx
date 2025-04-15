
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/media-detail/tabs/overview-tab";
import { CritiqueTab } from "@/components/media-detail/tabs/rating-tab";
import { ProgressionTab } from "@/components/media-detail/tabs/progression-tab";
import { WhereToWatchTab } from "@/components/media-detail/tabs/where-to-watch-tab";
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

  return (
    <Tabs 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col overflow-hidden"
    >
      <TabsList className="grid grid-cols-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border rounded-none p-0 shadow-sm">
        <TabsTrigger 
          value="overview" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Aperçu
        </TabsTrigger>
        <TabsTrigger 
          value="critique" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Critique
        </TabsTrigger>
        <TabsTrigger 
          value="whereto" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          {isMobile ? "Voir/Acheter" : "Où voir/acheter"}
        </TabsTrigger>
        <TabsTrigger 
          value="progression" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Progression
        </TabsTrigger>
      </TabsList>
      
      <ScrollArea className="flex-1 overflow-auto">
        <div className="px-4 py-4 pb-28">
          <TabsContent value="overview" className="mt-0 mb-0">
            <OverviewTab 
              description={formattedMedia.description} 
              additionalInfo={additionalInfo} 
              mediaId={id}
              mediaType={type}
            />
          </TabsContent>
          
          <TabsContent value="critique" className="mt-0 mb-0">
            <CritiqueTab 
              mediaId={id} 
              mediaType={type} 
              initialRating={formattedMedia.userRating}
            />
          </TabsContent>
          
          <TabsContent value="whereto" className="mt-0 mb-0">
            <WhereToWatchTab 
              mediaId={id} 
              mediaType={type} 
              title={formattedMedia.title || ""}
            />
          </TabsContent>
          
          <TabsContent value="progression" className="mt-0 mb-0">
            <ProgressionTab 
              mediaId={id} 
              mediaType={type} 
              mediaDetails={additionalInfo}
            />
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
}
