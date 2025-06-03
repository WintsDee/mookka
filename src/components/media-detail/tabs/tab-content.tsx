
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TabContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function TabContent({ id, type, formattedMedia, additionalInfo }: TabContentProps) {
  // Improved placeholder rendering with error handling
  const renderTabContent = React.useCallback((
    tabValue: string,
    isReady: boolean, 
    content: React.ReactNode,
    errorMessage?: string
  ) => {
    if (errorMessage) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      );
    }
    
    if (!isReady) {
      return (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-2/3" />
        </div>
      );
    }
    
    return content;
  }, []);

  // Validate required data
  const hasRequiredData = !!id && !!type && !!formattedMedia;
  const errorMessage = !hasRequiredData ? "Données du média indisponibles" : undefined;

  return (
    <>
      <TabsContent value="critique" className="space-y-6 mt-4">
        {renderTabContent(
          "critique",
          hasRequiredData,
          <CritiqueTab
            mediaId={id} 
            mediaType={type} 
            initialRating={formattedMedia?.userRating}
            initialReview={formattedMedia?.userReview}
          />,
          errorMessage
        )}
      </TabsContent>
      
      <TabsContent value="overview" className="space-y-6 mt-4">
        {renderTabContent(
          "overview",
          !!formattedMedia?.description, 
          <OverviewTab 
            description={formattedMedia?.description || ""} 
            additionalInfo={additionalInfo} 
            mediaId={id}
            mediaType={type}
          />,
          !formattedMedia?.description ? "Description non disponible" : undefined
        )}
      </TabsContent>
      
      <TabsContent value="whereto" className="space-y-6 mt-4">
        {renderTabContent(
          "whereto",
          hasRequiredData, 
          <WhereToWatchTab 
            mediaId={id} 
            mediaType={type} 
            title={formattedMedia?.title || ""}
          />,
          errorMessage
        )}
      </TabsContent>

      <TabsContent value="progression" className="space-y-6 mt-4">
        {renderTabContent(
          "progression",
          hasRequiredData, 
          <ProgressionTab 
            mediaId={id} 
            mediaType={type} 
            mediaDetails={additionalInfo}
          />,
          errorMessage
        )}
      </TabsContent>

      <TabsContent value="collections" className="space-y-6 mt-4">
        {renderTabContent(
          "collections",
          !!id, 
          <CollectionsTab mediaId={id} />,
          !id ? "Identifiant du média manquant" : undefined
        )}
      </TabsContent>
      
      <TabsContent value="news" className="space-y-6 mt-4">
        {renderTabContent(
          "news",
          !!type && !!formattedMedia?.title, 
          <NewsTab
            type={type}
            title={formattedMedia?.title}
          />,
          !type || !formattedMedia?.title ? "Informations du média manquantes" : undefined
        )}
      </TabsContent>
    </>
  );
}
