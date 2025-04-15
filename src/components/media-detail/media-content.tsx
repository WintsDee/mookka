
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/media-detail/tabs/overview-tab";
import { RatingTab } from "@/components/media-detail/tabs/rating-tab";
import { CollectionsTab } from "@/components/media-detail/tabs/collections-tab";
import { NewsTab } from "@/components/media-detail/tabs/news-tab";
import { MediaType } from "@/types";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col overflow-hidden pb-16"
    >
      <TabsList className="grid grid-cols-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border rounded-none p-0">
        <TabsTrigger 
          value="overview" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Aperçu
        </TabsTrigger>
        <TabsTrigger 
          value="rating" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Noter
        </TabsTrigger>
        <TabsTrigger 
          value="collections" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Collections
        </TabsTrigger>
        <TabsTrigger 
          value="news" 
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Actualités
        </TabsTrigger>
      </TabsList>
      
      <div className="overflow-y-auto overflow-x-hidden p-4 flex-1">
        <TabsContent value="overview" className="mt-0 h-full">
          <OverviewTab 
            description={formattedMedia.description} 
            additionalInfo={additionalInfo} 
            mediaId={id}
            mediaType={type}
          />
        </TabsContent>
        
        <TabsContent value="rating" className="mt-0 h-full">
          <RatingTab 
            mediaId={id} 
            mediaType={type} 
          />
        </TabsContent>
        
        <TabsContent value="collections" className="mt-0 h-full">
          <CollectionsTab mediaId={id} />
        </TabsContent>
        
        <TabsContent value="news" className="mt-0 h-full">
          <NewsTab type={type} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
