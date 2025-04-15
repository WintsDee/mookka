
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
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { addMediaToLibrary } from "@/services/media-service";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          const mediaData = await getMediaById(type as MediaType, id);
          
          if (mediaData && mediaData.description) {
            mediaData.description = mediaData.description.replace(/<br>/g, '\n');
          }
          
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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleAddToLibrary = async () => {
    if (!media) return;

    setIsAddingToLibrary(true);
    try {
      await addMediaToLibrary(media, type as MediaType);
      toast({
        title: "Succès",
        description: `${type === 'film' ? 'Le film' : type === 'serie' ? 'La série' : type === 'book' ? 'Le livre' : 'Le jeu'} a été ajouté à votre bibliothèque`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (addMediaToCollection && id) {
      addMediaToCollection({ collectionId, mediaId: id });
    }
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
      <div className="relative flex flex-col h-screen">
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type as MediaType} 
          onLike={handleLike}
          onAddToLibrary={handleAddToLibrary}
          onAddToCollection={() => setAddToCollectionOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          <MediaContent 
            id={id!} 
            type={type as MediaType} 
            formattedMedia={formattedMedia} 
            additionalInfo={additionalInfo} 
          />
        </div>
        
        <MediaDetailActions 
          media={media} 
          type={type as MediaType} 
          onAddToCollection={() => setAddToCollectionOpen(true)} 
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
}

export default MediaDetail;
