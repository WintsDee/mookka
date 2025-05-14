
import React, { useState, useEffect, useMemo } from "react";
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
import { MediaDetailSkeleton } from "@/components/media-detail/media-loading-skeleton";

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

  // Ajouter des logs pour débugger
  console.log("MediaDetail - Params:", { type, id });
  console.log("MediaDetail - Location state:", location.state);

  // Use a stable dependency array to prevent unnecessary re-fetches
  useEffect(() => {
    let isMounted = true;
    
    const fetchMediaDetails = async () => {
      if (!type || !id) {
        if (isMounted) {
          setError("Type de média ou identifiant manquant");
          setIsLoading(false);
          console.error("MediaDetail - Missing type or ID");
        }
        return;
      }
      
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      
      try {
        console.log(`MediaDetail - Fetching media details for ${type}/${id}`);
        const mediaData = await getMediaById(type as MediaType, id);
        
        if (!mediaData) {
          console.error(`MediaDetail - No data found for ${type}/${id}`);
          throw new Error("Média non trouvé");
        }
        
        console.log("MediaDetail - Media data received:", mediaData);
        
        if (!mediaData.id) {
          console.error("MediaDetail - Media data has no ID", mediaData);
          throw new Error("Données de média incorrectes");
        }
        
        const processedData = { ...mediaData };
        
        if (processedData.description) {
          processedData.description = processedData.description.replace(/<br>/g, '\n');
        }
        
        if (type === 'book' && !processedData.author && processedData.authors) {
          processedData.author = Array.isArray(processedData.authors) 
            ? processedData.authors.join(', ')
            : processedData.authors;
        }
        
        if (type === 'game' && processedData.description_raw && !processedData.locale_descriptions) {
          processedData.locale_descriptions = {
            'fr': processedData.description_raw
          };
        }
        
        if (isMounted) {
          setMedia(processedData);
          setIsLoading(false);
          console.log("MediaDetail - State updated with media data:", processedData);
        }
      } catch (error: any) {
        console.error("MediaDetail - Error fetching media:", error);
        if (isMounted) {
          const errorMessage = error.message || "Impossible de récupérer les détails du média";
          setError(errorMessage);
          setIsLoading(false);
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
    };

    fetchMediaDetails();
    
    // Cleanup function to prevent state updates after unmount
    return () => { 
      isMounted = false;
    };
  }, [type, id, toast]); // Stable dependencies

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

  // Memoize the formatted media and additional info to prevent unnecessary recalculations
  const { formattedMedia, additionalInfo } = useMemo(() => {
    if (!media || !type) {
      console.log("MediaDetail - No media or type available for formatting", { media, type });
      return { formattedMedia: null, additionalInfo: null };
    }

    try {
      console.log("MediaDetail - Formatting media data");
      const formatted = formatMediaDetails(media, type as MediaType);
      const additional = getAdditionalMediaInfo(media, formatted, type as MediaType);
      console.log("MediaDetail - Formatted media:", { formatted, additional });
      return { formattedMedia: formatted, additionalInfo: additional };
    } catch (err) {
      console.error("MediaDetail - Error formatting media details:", err);
      return { formattedMedia: null, additionalInfo: null };
    }
  }, [media, type]);

  console.log("MediaDetail - Render state:", { isLoading, media, formattedMedia, error });

  if (isLoading) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-full max-w-md px-4">
            <MediaDetailSkeleton />
          </div>
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

  // Protection supplémentaire - si formattedMedia est null malgré media présent
  if (!formattedMedia) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Erreur de formatage</h1>
          <p className="text-muted-foreground mb-4">Impossible d'afficher les informations du média.</p>
          <Button onClick={handleGoBack}>Retour</Button>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <div className="relative flex flex-col h-screen pt-safe animate-fade-in">
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
};

export default MediaDetail;
