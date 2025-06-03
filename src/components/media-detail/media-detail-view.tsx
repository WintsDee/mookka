
import React, { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { Background } from "@/components/ui/background";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaDetailViewProps {
  id: string;
  type: MediaType;
  media: any;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaDetailView({ id, type, media, formattedMedia, additionalInfo }: MediaDetailViewProps) {
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { addMediaToCollection, isAddingToCollection } = useCollections();
  const { toast } = useToast();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isViewReady, setIsViewReady] = useState(false);

  // Improved mounting strategy with better error handling
  useEffect(() => {
    if (!id || !type || !formattedMedia) {
      console.error("MediaDetailView: Missing required props", { id, type, formattedMedia: !!formattedMedia });
      return;
    }

    // Set view as ready when all required data is available
    setIsViewReady(true);
    
    // Use a more reliable mounting strategy
    const timeoutId = setTimeout(() => {
      setIsContentVisible(true);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [id, type, formattedMedia]);

  const handleAddToCollection = async (collectionId: string) => {
    if (!id) {
      toast({
        title: "Erreur",
        description: "Identifiant du média manquant",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addMediaToCollection({ collectionId, mediaId: id });
      toast({
        title: "Succès",
        description: "Média ajouté à la collection"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à la collection",
        variant: "destructive",
      });
    } finally {
      setAddToCollectionOpen(false);
    }
  };

  // Show loading state while data is being prepared
  if (!isViewReady) {
    return (
      <Background>
        <div className="relative flex flex-col h-screen">
          {/* Header skeleton */}
          <div className="h-52 w-full bg-muted animate-pulse" />
          
          {/* Content skeleton */}
          <div className="flex-1 p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-3/4" />
          </div>
          
          {/* Actions skeleton */}
          <div className="h-20 bg-muted animate-pulse" />
        </div>
      </Background>
    );
  }

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
    </Background>
  );
}
