
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaRating } from "@/hooks/use-media-rating";
import { MediaRating } from "@/components/media-rating";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaType } from "@/types";

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

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ajouter "{mediaTitle}" à votre bibliothèque</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <MediaRating mediaId={mediaId} mediaType={mediaType} />
          </div>
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
        <div className="py-4">
          <MediaRating mediaId={mediaId} mediaType={mediaType} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
