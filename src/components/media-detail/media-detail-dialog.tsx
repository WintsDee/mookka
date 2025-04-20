
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { MediaType } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: any;
  formattedMedia: any;
  type: MediaType;
  id: string;
  additionalInfo: any;
}

export function MediaDetailDialog({
  open,
  onOpenChange,
  media,
  formattedMedia,
  type,
  id,
  additionalInfo
}: MediaDetailDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Navigate back when dialog is closed
      if (location.state?.from) {
        // When navigating back, preserve the search params
        const previousPath = location.state.from;
        const searchParams = location.state.search || "";
        
        if (searchParams) {
          navigate({
            pathname: previousPath,
            search: searchParams
          }, { 
            replace: true
          });
        } else {
          navigate(previousPath, { 
            replace: true
          });
        }
      } else {
        // If no specific "from" path, just go back
        navigate(-1);
      }
    }
    onOpenChange(open);
  };

  // Force dialog to be open when component mounts
  useEffect(() => {
    if (!open) {
      onOpenChange(true);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-none w-full h-full p-0 gap-0 bg-background">
        <DialogClose asChild className="absolute top-2 right-4 z-50">
          <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/40 backdrop-blur-sm">
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
        <div className="flex flex-col h-full overflow-hidden">
          <MediaDetailHeader
            media={media}
            formattedMedia={formattedMedia}
            type={type}
            onAddToCollection={() => {}}
          />
          
          <div className="flex-1 overflow-hidden">
            <MediaContent 
              id={id} 
              type={type} 
              formattedMedia={formattedMedia} 
              additionalInfo={additionalInfo} 
            />
          </div>
          
          <MediaDetailActions 
            media={media} 
            type={type} 
            onAddToCollection={() => {}} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
