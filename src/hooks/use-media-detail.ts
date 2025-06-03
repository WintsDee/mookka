
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
  const mountedRef = useRef(true);
  const previousPath = location.state?.from || "/recherche";
  const searchParams = location.state?.search || "";

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      fetchInProgress.current = false;
    };
  }, []);

  // Memoized fetch function with improved error handling
  const fetchMediaDetails = useCallback(async () => {
    if (!type || !id || !mountedRef.current) {
      const errorMsg = "Type de média ou identifiant manquant";
      if (mountedRef.current) {
        setError(errorMsg);
        setIsLoading(false);
      }
      console.error("MediaDetail - Missing type or ID:", { type, id });
      return;
    }
    
    // Prevent duplicate fetches
    if (fetchInProgress.current) {
      console.log("MediaDetail - Fetch already in progress, skipping");
      return;
    }
    
    fetchInProgress.current = true;
    if (mountedRef.current) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      console.log(`MediaDetail - Fetching media details for ${type}/${id}`);
      const mediaData = await getMediaById(type as MediaType, id);
      
      if (!mountedRef.current) return;
      
      if (!mediaData) {
        console.error(`MediaDetail - No data found for ${type}/${id}`);
        throw new Error("Média non trouvé");
      }
      
      if (!mediaData.id) {
        console.error("MediaDetail - Media data has no ID", mediaData);
        throw new Error("Données de média incorrectes");
      }
      
      // Process the data with better validation
      const processedData = { ...mediaData };
      
      // Clean description
      if (processedData.description) {
        processedData.description = processedData.description.replace(/<br>/g, '\n');
      }
      
      // Handle book authors
      if (type === 'book' && !processedData.author && processedData.authors) {
        processedData.author = Array.isArray(processedData.authors) 
          ? processedData.authors.join(', ')
          : processedData.authors;
      }
      
      // Handle game descriptions
      if (type === 'game' && processedData.description_raw && !processedData.locale_descriptions) {
        processedData.locale_descriptions = {
          'fr': processedData.description_raw
        };
      }
      
      if (mountedRef.current) {
        setMedia(processedData);
        console.log("MediaDetail - Successfully loaded media data");
      }
    } catch (error: any) {
      console.error("MediaDetail - Error fetching media:", error);
      
      if (mountedRef.current) {
        const errorMessage = error.message || "Impossible de récupérer les détails du média";
        setError(errorMessage);
        
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      fetchInProgress.current = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [type, id, toast]);

  // Effect with cleanup
  useEffect(() => {
    fetchMediaDetails();
  }, [fetchMediaDetails]);

  // Computed values with null checks - mémoïsés pour éviter les recalculs
  const formattedMedia = media && type && mountedRef.current ? formatMediaDetails(media, type as MediaType) : null;
  const additionalInfo = media && formattedMedia && mountedRef.current ? getAdditionalMediaInfo(media, formattedMedia, type as MediaType) : null;

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
