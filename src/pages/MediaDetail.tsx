import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Loader2 } from "lucide-react";
import { getMediaById } from "@/services/media";
import { MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/media-formatter";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();

  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!type || !id) {
        setError("Type de média ou identifiant manquant");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching media details for ${type}/${id}`);
        const mediaData = await getMediaById(type as MediaType, id);
        
        if (!mediaData) {
          console.error(`Aucune donnée trouvée pour ${type}/${id}`);
          throw new Error("Média non trouvé");
        }
        
        console.log("Media data received:", mediaData);
        
        if (!mediaData.id) {
          console.error("Les données du média n'ont pas d'ID", mediaData);
          throw new Error("Données de média incorrectes");
        }
        
        if (mediaData.description) {
          mediaData.description = mediaData.description.replace(/<br>/g, '\n');
        }
        
        if (type === 'book' && !mediaData.author && mediaData.authors) {
          mediaData.author = Array.isArray(mediaData.authors) 
            ? mediaData.authors.join(', ')
            : mediaData.authors;
        }
        
        if (type === 'game' && mediaData.description_raw && !mediaData.locale_descriptions) {
          mediaData.locale_descriptions = {
            'fr': mediaData.description_raw
          };
        }
        
        setMedia(mediaData);
      } catch (error: any) {
        console.error("Erreur lors de la récupération du média:", error);
        const errorMessage = error.message || "Impossible de récupérer les détails du média";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetails();
  }, [type, id, toast]);

  const handleAddToCollection = (collectionId: string) => {
    if (!id) return;
    
    addMediaToCollection({ collectionId, mediaId: id });
    setAddToCollectionOpen(false);
  };

  const handleGoBack = () => {
    if (previousPath === "/recherche" && searchParams) {
      navigate({
        pathname: previousPath,
        search: searchParams
      }, { replace: true });
    } else {
      navigate(previousPath, { replace: true });
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

  if (error || !media) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
          <p className="text-muted-foreground mb-4">{error || "Les détails de ce média ne sont pas disponibles."}</p>
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }

  try {
    console.log("About to format media details", { type, mediaObject: media });
    const formattedMedia = formatMediaDetails(media, type as MediaType);
    console.log("Formatted media details", formattedMedia);
    
    const additionalInfo = getAdditionalMediaInfo(media, formattedMedia, type as MediaType);
    console.log("Additional info", additionalInfo);

    return (
      <Background>
        <div className="relative flex flex-col h-screen pt-safe">
          <MediaDetailHeader 
            media={media} 
            formattedMedia={formattedMedia} 
            type={type as MediaType}
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
  } catch (error: any) {
    console.error("Erreur lors du rendu du média:", error);
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Erreur d'affichage</h1>
          <p className="text-muted-foreground mb-4">Une erreur s'est produite lors de l'affichage du média.</p>
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }
}

export default MediaDetail;
