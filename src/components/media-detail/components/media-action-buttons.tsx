
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder, Trash2 } from "lucide-react";
import { MediaType } from "@/types";
import { MediaTypeIcon } from "./media-type-icon";
import { StatusDropdown } from "@/components/media-detail/status-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaActionButtonsProps {
  isInLibrary: boolean;
  mediaId: string;
  mediaType: MediaType;
  userMediaStatus: any;
  onGoBack: () => void;
  onOpenAddDialog: () => void;
  onOpenCollectionDialog: () => void;
  onOpenDeleteDialog: () => void;
}

export function MediaActionButtons({
  isInLibrary,
  mediaId,
  mediaType,
  userMediaStatus,
  onGoBack,
  onOpenAddDialog,
  onOpenCollectionDialog,
  onOpenDeleteDialog
}: MediaActionButtonsProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between gap-2 mb-safe pb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onGoBack}
        className="h-10 w-10 rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        {/* Status dropdown - only shown for media in library */}
        {isInLibrary && (
          <StatusDropdown
            mediaId={mediaId}
            mediaType={mediaType}
            currentStatus={userMediaStatus}
            isInLibrary={isInLibrary}
            size="sm"
          />
        )}
        
        {/* Bouton pour les collections */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={onOpenCollectionDialog}
        >
          <Folder className="h-5 w-5" />
        </Button>
        
        {/* Bouton pour supprimer de la bibliothèque - only shown for media in library */}
        {isInLibrary && (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-full"
            onClick={onOpenDeleteDialog}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
        
        {/* Bouton principal pour ajouter à la bibliothèque - only shown if not in library */}
        {!isInLibrary && (
          <Button onClick={onOpenAddDialog} className="gap-2 rounded-full">
            <MediaTypeIcon type={mediaType} />
            {isMobile ? "Ajouter" : "Ajouter à ma bibliothèque"}
          </Button>
        )}
      </div>
    </div>
  );
}
