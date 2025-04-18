
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { CritiqueTab } from "./rating-tab";
import { WhereToWatchTab } from "./where-to-watch";
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
          mediaId={id}
          mediaType={type}
        />
      </TabsContent>
      
      <TabsContent value="critique" className="space-y-6 mt-4">
        {id && type && (
          <CritiqueTab
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
