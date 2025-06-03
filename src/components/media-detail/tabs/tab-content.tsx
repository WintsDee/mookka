
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
  console.log("TabContent: Rendering with:", { id, type, hasFormattedMedia: !!formattedMedia });
  
  const renderTabContent = React.useCallback((
    tabValue: string,
    isReady: boolean, 
    content: React.ReactNode,
    errorMessage?: string
  ) => {
    console.log(`TabContent: Rendering ${tabValue} tab`, { isReady, hasError: !!errorMessage });
    
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

  const hasRequiredData = !!id && !!type && !!formattedMedia;
  const errorMessage = !hasRequiredData ? "Données du média indisponibles" : undefined;

  console.log("TabContent: Data validation", { hasRequiredData, errorMessage });

  // Wrapper pour les onglets avec gestion d'erreur
  const SafeTabContent = ({ children, tabName }: { children: React.ReactNode, tabName: string }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error(`TabContent: Error in ${tabName} tab:`, error);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur dans l'onglet {tabName}: {error instanceof Error ? error.message : "Erreur inconnue"}
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-4">
        <SafeTabContent tabName="Overview">
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
        </SafeTabContent>
      </TabsContent>
      
      <TabsContent value="critique" className="space-y-6 mt-4">
        <SafeTabContent tabName="Critique">
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
        </SafeTabContent>
      </TabsContent>
      
      <TabsContent value="whereto" className="space-y-6 mt-4">
        <SafeTabContent tabName="WhereToWatch">
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
        </SafeTabContent>
      </TabsContent>

      <TabsContent value="progression" className="space-y-6 mt-4">
        <SafeTabContent tabName="Progression">
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
        </SafeTabContent>
      </TabsContent>

      <TabsContent value="collections" className="space-y-6 mt-4">
        <SafeTabContent tabName="Collections">
          {renderTabContent(
            "collections",
            !!id, 
            <CollectionsTab mediaId={id} />,
            !id ? "Identifiant du média manquant" : undefined
          )}
        </SafeTabContent>
      </TabsContent>
      
      <TabsContent value="news" className="space-y-6 mt-4">
        <SafeTabContent tabName="News">
          {renderTabContent(
            "news",
            !!type && !!formattedMedia?.title, 
            <NewsTab
              type={type}
              title={formattedMedia?.title}
            />,
            !type || !formattedMedia?.title ? "Informations du média manquantes" : undefined
          )}
        </SafeTabContent>
      </TabsContent>
    </>
  );
}
