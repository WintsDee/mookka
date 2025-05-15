
import { useState, useEffect } from "react";
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

  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  // Use a stable dependency array to prevent unnecessary re-fetches
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2;
    
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
        
        // Implement retry logic for network errors
        if (retryCount < maxRetries && (error.name === 'AbortError' || error.message.includes('network') || error.message.includes('timeout'))) {
          retryCount++;
          console.log(`MediaDetail - Retry attempt ${retryCount} of ${maxRetries}`);
          
          // Exponential backoff for retries
          setTimeout(() => {
            if (isMounted) fetchMediaDetails();
          }, 1000 * Math.pow(2, retryCount));
          return;
        }
        
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

  // Compute formatted media and additional info
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
