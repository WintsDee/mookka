
import React, { memo, useCallback } from "react";
import { Share2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaType } from "@/types";
import { ActionButton } from "./action-button";
import { useMediaLibraryManagement } from "@/hooks/media/use-media-library-management";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaDetailActionsProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  className?: string;
  onLibraryChange?: () => void;
}

const MediaDetailActions = memo(({
  mediaId,
  mediaType,
  mediaTitle,
  className,
  onLibraryChange
}: MediaDetailActionsProps) => {
  const {
    isInLibrary,
    isLoading,
    isAdding,
    isRemoving,
    addToLibrary,
    removeFromLibrary
  } = useMediaLibraryManagement(mediaId, mediaType, mediaTitle);

  const handleAddToLibrary = useCallback(async () => {
    await addToLibrary();
    if (onLibraryChange) onLibraryChange();
  }, [addToLibrary, onLibraryChange]);

  const handleRemoveFromLibrary = useCallback(async () => {
    await removeFromLibrary();
    if (onLibraryChange) onLibraryChange();
  }, [removeFromLibrary, onLibraryChange]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ActionButton onClick={() => {}} isLoading={false}>
              <Share2 className="mr-1 h-3 w-3" />
              Partager
            </ActionButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Partager ce média</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isInLibrary ? (
        <ActionButton 
          onClick={handleRemoveFromLibrary}
          disabled={isRemoving}
          isLoading={isRemoving}
          className="text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <X className="mr-1 h-3 w-3" />
          Retirer
        </ActionButton>
      ) : (
        <ActionButton
          onClick={handleAddToLibrary}
          disabled={isAdding}
          isLoading={isAdding || isLoading}
          className={`text-media-${mediaType} border-media-${mediaType}/30 hover:bg-media-${mediaType}/10`}
        >
          <Plus className="mr-1 h-3 w-3" />
          Ajouter
        </ActionButton>
      )}
    </div>
  );
});

MediaDetailActions.displayName = "MediaDetailActions";

export { MediaDetailActions };
