
import React, { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { Background } from "@/components/ui/background";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { useToast } from "@/hooks/use-toast";

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

  // Use a more reliable mounting strategy with requestAnimationFrame for smooth transitions
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM has updated before showing content
    const frameId = requestAnimationFrame(() => {
      setIsContentVisible(true);
    });
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

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

  return (
    <Background>
      <div className={`relative flex flex-col h-screen pt-safe transition-opacity duration-300 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type}
          onAddToCollection={() => setAddToCollectionOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
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
