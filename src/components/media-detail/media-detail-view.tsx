
import React, { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { Background } from "@/components/ui/background";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { useCollections } from "@/hooks/use-collections";
import { useMediaRating } from "@/hooks/use-media-rating";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaDetailViewProps {
  id: string;
  type: MediaType;
  media: any;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaDetailView({ id, type, media, formattedMedia, additionalInfo }: MediaDetailViewProps) {
  console.log("MediaDetailView: Rendering with props:", { 
    id, 
    type, 
    hasMedia: !!media, 
    hasFormattedMedia: !!formattedMedia,
    hasAdditionalInfo: !!additionalInfo 
  });
  
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { addMediaToCollection, isAddingToCollection, showSuccessAnimation: showCollectionSuccess, hideSuccessAnimation: hideCollectionSuccess } = useCollections();
  const { showSuccessAnimation: showRatingSuccess, hideSuccessAnimation: hideRatingSuccess } = useMediaRating(id, type);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isViewReady, setIsViewReady] = useState(false);

  useEffect(() => {
    console.log("MediaDetailView: Effect running with:", { id, type, formattedMedia: !!formattedMedia });
    
    if (!id || !type || !formattedMedia) {
      console.error("MediaDetailView: Missing required props", { id, type, formattedMedia: !!formattedMedia });
      return;
    }

    console.log("MediaDetailView: Setting view as ready");
    setIsViewReady(true);
    
    const timeoutId = setTimeout(() => {
      console.log("MediaDetailView: Setting content as visible");
      setIsContentVisible(true);
    }, 50);
    
    return () => {
      console.log("MediaDetailView: Cleaning up timeout");
      clearTimeout(timeoutId);
    };
  }, [id, type, formattedMedia]);

  const handleAddToCollection = async (collectionId: string) => {
    if (!id) return;
    
    try {
      await addMediaToCollection({ collectionId, mediaId: id });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la collection:", error);
    } finally {
      setAddToCollectionOpen(false);
    }
  };

  // Show loading state while data is being prepared
  if (!isViewReady) {
    console.log("MediaDetailView: Showing loading state - view not ready");
    return (
      <Background>
        <div className="relative flex flex-col h-screen">
          <div className="h-52 w-full bg-muted animate-pulse" />
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-3/4" />
          </div>
          <div className="h-20 bg-muted animate-pulse" />
        </div>
      </Background>
    );
  }

  console.log("MediaDetailView: Rendering main content", { isContentVisible });

  try {
    return (
      <Background>
        <div className={`relative flex flex-col h-screen transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <MediaDetailHeader 
            media={media} 
            formattedMedia={formattedMedia} 
            type={type}
            onAddToCollection={() => setAddToCollectionOpen(true)}
          />
          
          <div className="flex-1 overflow-y-auto">
            {isContentVisible && (
              <MediaContent 
                id={id} 
                type={type} 
                formattedMedia={formattedMedia} 
                additionalInfo={additionalInfo} 
              />
            )}
          </div>
          
          <MediaDetailActions 
            media={media || {id}} 
            type={type} 
            onAddToCollection={() => setAddToCollectionOpen(true)} 
          />
        </div>
        
        <AddToCollectionDialog
          open={addToCollectionOpen}
          onOpenChange={setAddToCollectionOpen}
          mediaId={id}
          onAddToCollection={handleAddToCollection}
          isAddingToCollection={isAddingToCollection}
        />
        
        <SuccessAnimation 
          show={showCollectionSuccess} 
          message="Ajouté à la collection !"
          onComplete={hideCollectionSuccess}
        />
        
        <SuccessAnimation 
          show={showRatingSuccess} 
          message="Note enregistrée !"
          onComplete={hideRatingSuccess}
        />
      </Background>
    );
  } catch (error) {
    console.error("MediaDetailView: Error during render:", error);
    return (
      <Background>
        <div className="relative flex flex-col h-screen p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur de rendu MediaDetailView:</strong> {error instanceof Error ? error.message : "Erreur inconnue"}
          </div>
        </div>
      </Background>
    );
  }
}
