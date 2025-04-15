
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Loader2 } from "lucide-react";
import { getMediaById } from "@/services/media-service";
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/media-formatter";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { MediaContent } from "@/components/media-detail/media-content";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          const mediaData = await getMediaById(type as MediaType, id);
          setMedia(mediaData);
        } catch (error) {
          console.error("Erreur lors de la récupération du média:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails du média",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMediaDetails();
  }, [type, id, toast]);

  const handleAddToCollection = (collectionId: string) => {
    if (!id) return;
    
    addMediaToCollection({ collectionId, mediaId: id });
    setAddToCollectionOpen(false);
  };

  if (isLoading) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </Background>
    );
  }

  if (!media) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </Background>
    );
  }

  const formattedMedia = formatMediaDetails(media, type as MediaType);
  const additionalInfo = getAdditionalMediaInfo(media, formattedMedia, type as MediaType);

  return (
    <Background>
      <MobileHeader />
      <div className="relative pb-24">
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type as MediaType} 
        />
        
        <MediaDetailActions 
          media={media} 
          type={type as MediaType} 
          onAddToCollection={() => setAddToCollectionOpen(true)} 
        />
        
        <MediaContent 
          id={id!} 
          type={type as MediaType} 
          formattedMedia={formattedMedia} 
          additionalInfo={additionalInfo} 
        />
      </div>
      
      <AddToCollectionDialog
        open={addToCollectionOpen}
        onOpenChange={setAddToCollectionOpen}
        mediaId={id!}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
    </Background>
  );
};

export default MediaDetail;
