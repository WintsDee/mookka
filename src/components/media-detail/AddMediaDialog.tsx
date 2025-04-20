
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaRating } from "@/hooks/use-media-rating";
import { MediaRating } from "@/components/media-rating";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AddMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function AddMediaDialog({ 
  isOpen, 
  onOpenChange, 
  mediaId,
  mediaType,
  mediaTitle 
}: AddMediaDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  
  const { isSubmitting } = useMediaRating(mediaId, mediaType);
  
  // Réinitialiser l'état de complétion si le dialogue est rouvert
  useEffect(() => {
    if (isOpen) {
      setIsComplete(false);
    }
  }, [isOpen]);
  
  const handleRatingComplete = () => {
    setIsComplete(true);
    toast({
      title: "Média ajouté",
      description: `"${mediaTitle}" a été ajouté à votre bibliothèque avec succès.`
    });
  };
  
  const handleViewLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };
  
  const dialogContent = (
    <>
      <div className={isMobile ? "px-4 pb-8" : "py-4"}>
        <MediaRating 
          mediaId={mediaId} 
          mediaType={mediaType} 
          onRatingComplete={handleRatingComplete}
        />
        
        {isComplete && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleViewLibrary}>
              Voir ma bibliothèque
            </Button>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ajouter "{mediaTitle}" à votre bibliothèque</DrawerTitle>
          </DrawerHeader>
          {dialogContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter "{mediaTitle}" à votre bibliothèque</DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
