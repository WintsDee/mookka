
import React, { useEffect } from "react";
import { MediaType } from "@/types";
import { AddMediaDialog } from "./dialog/add-media";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useMediaActions } from "./hooks/use-media-actions";
import { MediaActionButtons } from "./components/media-action-buttons";
import { DeleteMediaDialog } from "./components/delete-media-dialog";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection?: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  // Ensure media has required properties
  const safeMedia = {
    id: media?.id || '',
    title: media?.title || 'Média sans titre',
    ...media
  };

  const {
    isInLibrary,
    setIsInLibrary,
    addDialogOpen,
    setAddDialogOpen,
    addCollectionDialogOpen,
    setAddCollectionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    isAddingToCollection,
    handleGoBack,
    handleDeleteMedia,
    handleAddToCollection,
    userMediaStatus
  } = useMediaActions({
    mediaId: safeMedia.id,
    mediaType: type,
    mediaTitle: safeMedia.title
  });
  
  // Update isInLibrary when userMediaStatus changes
  useEffect(() => {
    const isInLib = userMediaStatus !== null;
    if (isInLib !== isInLibrary) {
      setIsInLibrary(isInLib);
    }
  }, [userMediaStatus, isInLibrary, setIsInLibrary]);

  // Don't render if essential data is missing
  if (!safeMedia.id) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 px-4 py-3 shadow-md">
        <MediaActionButtons
          isInLibrary={isInLibrary}
          mediaId={safeMedia.id}
          mediaType={type}
          userMediaStatus={userMediaStatus}
          onGoBack={handleGoBack}
          onOpenAddDialog={() => setAddDialogOpen(true)}
          onOpenCollectionDialog={() => setAddCollectionDialogOpen(true)}
          onOpenDeleteDialog={() => setDeleteDialogOpen(true)}
        />
      </div>
      
      <AddMediaDialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mediaId={safeMedia.id}
        mediaType={type}
        mediaTitle={safeMedia.title}
      />
      
      <AddToCollectionDialog
        open={addCollectionDialogOpen}
        onOpenChange={setAddCollectionDialogOpen}
        mediaId={safeMedia.id}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
      
      <DeleteMediaDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteMedia}
        isDeleting={isDeleting}
        mediaTitle={safeMedia.title}
      />
    </>
  );
}
