
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { Loader2 } from "lucide-react";
import { getMediaById } from "@/services/media";
import { MediaType } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { formatMediaDetails, getAdditionalMediaInfo } from "@/components/media-detail/media-formatter";
import { MediaDetailDialog } from "@/components/media-detail/media-detail-dialog";

const MediaDetail = () => {
  const { type, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<any>(null);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (type && id) {
        setIsLoading(true);
        try {
          console.log(`Fetching media details for ${type}/${id}`);
          const mediaData = await getMediaById(type as MediaType, id);
          
          if (!mediaData) {
            throw new Error("Média non trouvé");
          }
          
          if (mediaData && mediaData.description) {
            mediaData.description = mediaData.description.replace(/<br>/g, '\n');
          }
          
          if (type === 'game' && mediaData.description_raw && !mediaData.locale_descriptions) {
            mediaData.locale_descriptions = {
              'fr': mediaData.description_raw
            };
          }
          
          console.log("Media data received:", mediaData);
          setMedia(mediaData);
        } catch (error) {
          console.error("Erreur lors de la récupération du média:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails du média",
            variant: "destructive",
          });
          // Navigate back if media can't be loaded
          setTimeout(() => navigate(-1), 1500);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMediaDetails();
  }, [type, id, toast, navigate]);

  // Handle dialog closing
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // If we close the dialog, navigate back (handled by the dialog component)
    }
  };

  if (isLoading) {
    return (
      <Background>
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
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Média non trouvé</h1>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Retour
          </button>
        </div>
      </Background>
    );
  }

  const formattedMedia = formatMediaDetails(media, type as MediaType);
  const additionalInfo = getAdditionalMediaInfo(media, formattedMedia, type as MediaType);

  return (
    <Background>
      <MediaDetailDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        media={media}
        formattedMedia={formattedMedia}
        type={type as MediaType}
        id={id!}
        additionalInfo={additionalInfo}
      />
    </Background>
  );
};

export default MediaDetail;
