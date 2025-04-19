
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaType } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";

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
        navigate(location.state.from, { 
          replace: true,
          state: location.state 
        });
      } else {
        navigate(-1);
      }
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-none w-full h-full p-0 gap-0 bg-background">
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
