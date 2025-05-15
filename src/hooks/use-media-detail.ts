
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MediaType } from "@/types";
import { getMediaById } from "@/services/media";
import { useToast } from "@/hooks/use-toast";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/media-formatter";

export function useMediaDetail() {
  const { type, id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fetchInProgress = useRef(false);
  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchMediaDetails = useCallback(async () => {
    if (!type || !id) {
      setError("Type de média ou identifiant manquant");
      setIsLoading(false);
      console.error("MediaDetail - Missing type or ID");
      return;
    }
    
    // Prevent duplicate fetches
    if (fetchInProgress.current) {
      console.log("MediaDetail - Fetch already in progress, skipping");
      return;
    }
    
    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`MediaDetail - Fetching media details for ${type}/${id}`);
      const mediaData = await getMediaById(type as MediaType, id);
      
      if (!mediaData) {
        console.error(`MediaDetail - No data found for ${type}/${id}`);
        throw new Error("Média non trouvé");
      }
      
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
      
      setMedia(processedData);
    } catch (error: any) {
      console.error("MediaDetail - Error fetching media:", error);
      
      const errorMessage = error.message || "Impossible de récupérer les détails du média";
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [type, id, toast]);

  // Use a stable effect for fetching
  useEffect(() => {
    fetchMediaDetails();
    
    // Cleanup function
    return () => {
      fetchInProgress.current = false;
    };
  }, [fetchMediaDetails]);

  // Pre-compute formatted media and additional info only when dependencies change
  const formattedMedia = media && type ? formatMediaDetails(media, type as MediaType) : null;
  const additionalInfo = media && formattedMedia ? getAdditionalMediaInfo(media, formattedMedia, type as MediaType) : null;

  return {
    isLoading,
    media,
    error,
    formattedMedia,
    additionalInfo,
    type: type as MediaType,
    id,
    previousPath,
    searchParams
  };
}
