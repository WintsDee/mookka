
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Trash2 } from "lucide-react";
import { MediaType, MediaStatus } from "@/types";

interface MediaActionButtonsProps {
  isInLibrary: boolean;
  mediaId: string;
  mediaType: MediaType;
  userMediaStatus: MediaStatus | null;
  onGoBack: () => void;
  onOpenAddDialog: () => void;
  onOpenCollectionDialog: () => void;
  onOpenDeleteDialog: () => void;
}

export function MediaActionButtons({
  isInLibrary,
  onOpenAddDialog,
  onOpenCollectionDialog,
  onOpenDeleteDialog
}: MediaActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {isInLibrary ? (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCollectionDialog}
            className="flex-1"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Collections
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onOpenDeleteDialog}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={onOpenAddDialog}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter à ma bibliothèque
        </Button>
      )}
    </div>
  );
}
