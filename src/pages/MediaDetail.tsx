
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Loader2, AlertTriangle } from "lucide-react";
import { getMediaById } from "@/services/media"; // Updated import path
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/formatters"; // Updated import path
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [hasError, setHasError] = useState(false);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();

  // Store the previous path and search parameters to navigate back correctly
  // Extract path without trailing segment that might cause issues
  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  useEffect(() => {
    const fetchMediaDetails = async () => {
      // Vérifier si l'ID contient un segment de route supplémentaire
      let cleanId = id;
      if (id && id.includes('/')) {
        // Extraire l'ID réel sans le segment supplémentaire
        cleanId = id.split('/')[0];
      }
      
      if (type && cleanId) {
        setIsLoading(true);
        setHasError(false);
        
        try {
          console.log(`Fetching details for ${type}/${cleanId}`);
          const mediaData = await getMediaById(type as MediaType, cleanId);
          
          console.log("Media data received:", mediaData ? "yes" : "no");
          
          if (!mediaData) {
            setHasError(true);
            toast({
              title: "Erreur",
              description: "Les détails du média n'ont pas pu être trouvés",
              variant: "destructive",
            });
            return;
          }
          
          // Convertir les <br> en saut de ligne pour le détail du média
          if (mediaData && mediaData.description) {
            mediaData.description = mediaData.description.replace(/<br>/g, '\n');
          }
          
          // Vérifier si la description est en anglais et tenter de trouver une version française
          if (type === 'game' && mediaData.description_raw && !mediaData.locale_descriptions) {
            mediaData.locale_descriptions = {
              'fr': mediaData.description_raw // Utiliser la description brute comme fallback
            };
          }
          
          setMedia(mediaData);
        } catch (error) {
          console.error("Erreur lors de la récupération du média:", error);
          setHasError(true);
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
    
    // Nettoyer l'ID si nécessaire
    const cleanId = id.includes('/') ? id.split('/')[0] : id;
    
    addMediaToCollection({ collectionId, mediaId: cleanId });
    setAddToCollectionOpen(false);
  };

  const handleGoBack = () => {
    // Navigate back to the previous page preserving state and search params
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
        <MobileHeader 
          showBackButton={true}
          onBackClick={handleGoBack}
        />
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </Background>
    );
  }

  if (hasError || !media) {
    return (
      <Background>
        <MobileHeader 
          showBackButton={true}
          onBackClick={handleGoBack}
        />
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
          <p className="text-muted-foreground mb-6 text-center px-4">
            Impossible de charger les détails de ce média. Il pourrait ne plus être disponible ou avoir été déplacé.
          </p>
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }

  try {
    // Add try-catch block around the formatting to prevent errors
    const formattedMedia = formatMediaDetails(media, type as MediaType);
    const additionalInfo = getAdditionalMediaInfo(media, formattedMedia, type as MediaType);

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
  } catch (error) {
    console.error("Error formatting media:", error);
    return (
      <Background>
        <MobileHeader 
          showBackButton={true}
          onBackClick={handleGoBack}
        />
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Erreur de format</h1>
          <p className="text-muted-foreground mb-6 text-center px-4">
            Une erreur s'est produite lors du formatage des données. Veuillez réessayer plus tard.
          </p>
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }
}

export default MediaDetail;
