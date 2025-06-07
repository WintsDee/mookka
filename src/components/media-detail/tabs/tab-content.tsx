
import React, { memo, useMemo } from "react";
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
import { MediaDetailErrorBoundary } from "../error-boundary";

interface TabContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

const TabContentComponent = ({ id, type, formattedMedia, additionalInfo }: TabContentProps) => {
  // Validation des données avec useMemo pour éviter les recalculs
  const dataValidation = useMemo(() => {
    const hasRequiredData = Boolean(id && type && formattedMedia);
    const errorMessage = !hasRequiredData ? "Données du média indisponibles" : undefined;
    
    return { hasRequiredData, errorMessage };
  }, [id, type, formattedMedia]);

  const { hasRequiredData, errorMessage } = dataValidation;

  // Composant pour le rendu sécurisé avec ErrorBoundary
  const SafeTabContent = memo(({ children, tabName }: { children: React.ReactNode, tabName: string }) => {
    return (
      <MediaDetailErrorBoundary
        fallback={
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur dans l'onglet {tabName}. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        }
      >
        {children}
      </MediaDetailErrorBoundary>
    );
  });

  SafeTabContent.displayName = 'SafeTabContent';

  // Fonction de rendu optimisée
  const renderTabContent = (
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
  };

  return (
    <>
      <TabsContent value="overview" className="space-y-6 mt-4">
        <SafeTabContent tabName="Aperçu">
          {renderTabContent(
            Boolean(formattedMedia?.description), 
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
        <SafeTabContent tabName="Où voir/acheter">
          {renderTabContent(
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
            Boolean(id), 
            <CollectionsTab mediaId={id} />,
            !id ? "Identifiant du média manquant" : undefined
          )}
        </SafeTabContent>
      </TabsContent>
      
      <TabsContent value="news" className="space-y-6 mt-4">
        <SafeTabContent tabName="Actualités">
          {renderTabContent(
            Boolean(type && formattedMedia?.title), 
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
};

// Mémoïsation pour éviter les re-rendus inutiles
export const TabContent = memo(TabContentComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.type === nextProps.type &&
    JSON.stringify(prevProps.formattedMedia) === JSON.stringify(nextProps.formattedMedia) &&
    JSON.stringify(prevProps.additionalInfo) === JSON.stringify(nextProps.additionalInfo)
  );
});

TabContent.displayName = 'TabContent';
