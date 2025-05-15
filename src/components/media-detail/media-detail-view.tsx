
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
  const [isContentMounted, setIsContentMounted] = useState(false);

  // Effet pour éviter le clignotement au montage du composant
  useEffect(() => {
    // Petit délai pour s'assurer que le contenu est bien monté
    const timer = setTimeout(() => {
      setIsContentMounted(true);
    }, 50);

    return () => clearTimeout(timer);
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

  // Afficher seulement quand les données sont prêtes pour éviter le clignotement
  const showContent = isContentMounted && media && formattedMedia;

  return (
    <Background>
      <div className="relative flex flex-col h-screen pt-safe animate-fade-in">
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type}
          onAddToCollection={() => setAddToCollectionOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          {showContent && (
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
