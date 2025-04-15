
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { RatingTab } from "./rating-tab";
import { CollectionsTab } from "./collections-tab";
import { MediaType } from "@/types";

interface TabContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function TabContent({ id, type, formattedMedia, additionalInfo }: TabContentProps) {
  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-4">
        <OverviewTab 
          description={formattedMedia.description} 
          additionalInfo={additionalInfo} 
        />
      </TabsContent>
      
      <TabsContent value="rating" className="space-y-6 mt-4">
        {id && type && (
          <RatingTab
            mediaId={id}
            mediaType={type}
            initialRating={0}
          />
        )}
      </TabsContent>
      
      <TabsContent value="collections" className="space-y-6 mt-4">
        {id && (
          <CollectionsTab mediaId={id} />
        )}
      </TabsContent>
    </>
  );
}
