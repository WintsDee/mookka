
import React from "react";
import { ChevronLeft, BookmarkPlus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export interface MediaDetailHeaderProps {
  media: any;
  formattedMedia: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailHeader({ 
  media, 
  formattedMedia, 
  type,
  onAddToCollection 
}: MediaDetailHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const goBack = () => {
    navigate(-1);
  };
  
  const handleShare = () => {
    // Check if native share is available
    if (navigator.share) {
      navigator.share({
        title: formattedMedia.title,
        text: `Découvre ${formattedMedia.title} sur Mookka !`,
        url: window.location.href,
      }).catch(error => {
        console.error("Erreur lors du partage:", error);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pt-safe">
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={goBack} className="hover:bg-background/60">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddToCollection}
            className="hover:bg-background/60"
          >
            <BookmarkPlus className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="hover:bg-background/60"
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
