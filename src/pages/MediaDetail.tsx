
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
import { Skeleton } from "@/components/ui/skeleton";

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

  // Use a stable dependency array to prevent unnecessary re-fetches
  useEffect(() => {
    let isMounted = true;
    const fetchMediaDetails = async () => {
      if (!type || !id) {
        if (isMounted) {
          setError("Type de média ou identifiant manquant");
          setIsLoading(false);
        }
        return;
      }
      
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      
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
        }
      } catch (error: any) {
        console.error("Erreur lors de la récupération du média:", error);
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
      return { formattedMedia: null, additionalInfo: null };
    }

    try {
      const formatted = formatMediaDetails(media, type as MediaType);
      const additional = getAdditionalMediaInfo(media, formatted, type as MediaType);
      return { formattedMedia: formatted, additionalInfo: additional };
    } catch (err) {
      console.error("Error formatting media details:", err);
      return { formattedMedia: null, additionalInfo: null };
    }
  }, [media, type]);

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

  if (error || !media || !formattedMedia) {
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

// Skeleton loader for better UX during loading
const MediaDetailSkeleton = () => {
  return (
    <div className="animate-fade-in space-y-4 w-full">
      {/* Header skeleton */}
      <div className="relative h-52 w-full">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 p-6 w-full flex items-end">
          <Skeleton className="w-24 h-36 rounded-lg" />
          <div className="flex-1 ml-4 space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <div className="flex gap-1.5 flex-wrap pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-4 px-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Content skeleton */}
      <div className="px-4 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export default MediaDetail;
