
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Loader2 } from "lucide-react";
import { getMediaById, getUserMediaLibrary } from "@/services/media";
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
import { useAuth } from "@/providers/auth-provider";

const MediaDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();
  const { user } = useAuth();

  // Store the previous path and search parameters to navigate back correctly
  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  // Vérifier si le média est dans la bibliothèque de l'utilisateur
  const checkIfInLibrary = async () => {
    if (!user || !id) {
      setIsCheckingLibrary(false);
      return;
    }

    try {
      setIsCheckingLibrary(true);
      const userLibrary = await getUserMediaLibrary();
      const mediaInLibrary = userLibrary.some(item => item.id === id);
      setIsInLibrary(mediaInLibrary);
    } catch (error) {
      console.error("Erreur lors de la vérification de la bibliothèque:", error);
    } finally {
      setIsCheckingLibrary(false);
    }
  };

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          const mediaData = await getMediaById(type as MediaType, id);
          
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

  useEffect(() => {
    checkIfInLibrary();
  }, [user, id]);

  const handleAddToCollection = (collectionId: string) => {
    if (!id) return;
    
    addMediaToCollection({ collectionId, mediaId: id });
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

  const handleLibraryStatusChange = () => {
    // Inverser l'état actuel pour une réponse instantanée à l'utilisateur
    setIsInLibrary(prev => !prev);
    // Réactualiser depuis la base de données pour s'assurer que tout est à jour
    checkIfInLibrary();
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
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }

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
          isInLibrary={isInLibrary}
          onLibraryChange={handleLibraryStatusChange}
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
