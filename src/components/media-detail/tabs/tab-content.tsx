
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { RatingTab } from "./rating-tab";
import { WhereToWatchTab } from "./where-to-watch-tab";
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
          description={formattedMedia.description?.replace(/<br>/g, '\n')} 
          additionalInfo={additionalInfo}
          mediaId={id}
          mediaType={type}
        />
      </TabsContent>
      
      <TabsContent value="rating" className="space-y-6 mt-4">
        {id && type && (
          <RatingTab
            mediaId={id}
            mediaType={type}
          />
        )}
      </TabsContent>
      
      <TabsContent value="whereto" className="space-y-6 mt-4">
        {id && (
          <WhereToWatchTab 
            mediaId={id} 
            mediaType={type} 
            title={formattedMedia.title || ""}
          />
        )}
      </TabsContent>
    </>
  );
}
