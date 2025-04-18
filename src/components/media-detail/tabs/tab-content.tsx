
import React, { Suspense } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { CritiqueTab } from "./rating-tab";
import { WhereToWatchTab } from "./where-to-watch";
import { MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { WhereToWatchLoading } from "./where-to-watch/where-to-watch-loading";

const TabSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-24 w-full" />
  </div>
);

interface TabContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function TabContent({ id, type, formattedMedia, additionalInfo }: TabContentProps) {
  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-4 transition-opacity duration-300">
        <Suspense fallback={<TabSkeleton />}>
          <OverviewTab 
            description={formattedMedia.description} 
            additionalInfo={additionalInfo}
            mediaId={id}
            mediaType={type}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="critique" className="space-y-6 mt-4 transition-opacity duration-300">
        {id && type && (
          <Suspense fallback={<TabSkeleton />}>
            <CritiqueTab
              mediaId={id}
              mediaType={type}
            />
          </Suspense>
        )}
      </TabsContent>
      
      <TabsContent value="whereto" className="space-y-6 mt-4 transition-opacity duration-300">
        {id && (
          <Suspense fallback={<WhereToWatchLoading />}>
            <WhereToWatchTab 
              mediaId={id} 
              mediaType={type} 
              title={formattedMedia.title || ""}
            />
          </Suspense>
        )}
      </TabsContent>
    </>
  );
}
