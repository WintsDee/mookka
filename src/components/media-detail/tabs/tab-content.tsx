
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewTab } from "./overview-tab";
import { CritiqueTab } from "./rating-tab";
import { WhereToWatchTab } from "./where-to-watch";
import { ProgressionTab } from "./progression";
import { NewsTab } from "./news-tab";
import { MediaType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionsTab } from "./collections-tab";

interface TabContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function TabContent({ id, type, formattedMedia, additionalInfo }: TabContentProps) {
  // Fonction pour afficher un placeholder si les données ne sont pas encore disponibles
  const renderSkeletonIfNeeded = (isReady: boolean, content: React.ReactNode) => {
    if (!isReady) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-2/3" />
        </div>
      );
    }
    return content;
  };

  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!formattedMedia?.description, 
          <OverviewTab 
            description={formattedMedia?.description || ""} 
            additionalInfo={additionalInfo} 
            mediaId={id}
            mediaType={type}
          />
        )}
      </TabsContent>
      
      <TabsContent value="critique" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!id && !!type, 
          <CritiqueTab
            mediaId={id} 
            mediaType={type} 
            initialRating={formattedMedia?.userRating}
            initialReview={formattedMedia?.userReview}
          />
        )}
      </TabsContent>
      
      <TabsContent value="whereto" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!id && !!type, 
          <WhereToWatchTab 
            mediaId={id} 
            mediaType={type} 
            title={formattedMedia?.title || ""}
          />
        )}
      </TabsContent>

      <TabsContent value="progression" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!id && !!type, 
          <ProgressionTab 
            mediaId={id} 
            mediaType={type} 
            mediaDetails={additionalInfo}
          />
        )}
      </TabsContent>

      <TabsContent value="collections" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!id, 
          <CollectionsTab
            mediaId={id}
          />
        )}
      </TabsContent>
      
      <TabsContent value="news" className="space-y-6 mt-4">
        {renderSkeletonIfNeeded(!!type, 
          <NewsTab
            type={type}
            title={formattedMedia?.title}
          />
        )}
      </TabsContent>
    </>
  );
}
