
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "@/types";
import { getMediaById } from "@/services/media";
import { useToast } from "@/components/ui/use-toast";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/formatters";

export function useMediaDetail() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Store the previous path and search parameters to navigate back correctly
  const previousPath = location.state?.from || "/decouvrir";
  const searchParams = location.state?.search || "";

  useEffect(() => {
    // Rediriger si l'URL contient des segments supplémentaires
    if (id && id.includes('/')) {
      const cleanId = id.split('/')[0];
      navigate(`/media/${type}/${cleanId}`, { 
        state: location.state,
        replace: true 
      });
      return;
    }
    
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        setHasError(false);
        
        try {
          console.log(`Fetching details for ${type}/${id}`);
          const mediaData = await getMediaById(type as MediaType, id);
          
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
          
          if (mediaData && mediaData.description) {
            mediaData.description = mediaData.description.replace(/<br>/g, '\n');
          }
          
          if (type === 'game' && mediaData.description_raw && !mediaData.locale_descriptions) {
            mediaData.locale_descriptions = {
              'fr': mediaData.description_raw
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
  }, [type, id, toast, navigate, location.state]);

  const formattedMedia = media ? formatMediaDetails(media, type as MediaType) : null;
  const additionalInfo = media && formattedMedia ? getAdditionalMediaInfo(media, formattedMedia, type as MediaType) : null;

  return {
    isLoading,
    hasError,
    media,
    formattedMedia,
    additionalInfo,
    previousPath,
    searchParams,
    type: type as MediaType,
    id
  };
}
