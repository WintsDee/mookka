
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaType } from "@/types";
import { useAddMediaState } from "./hooks/use-add-media-state";
import { DialogContent } from "./dialog-content";

export interface AddMediaDialogProps {
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
  
  const {
    selectedStatus,
    notes,
    isAddingToLibrary,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    errorMessage,
    handleStatusSelect,
    handleNotesChange,
    handleAddToLibrary,
    handleRatingComplete,
    handleViewLibrary
  } = useAddMediaState({
    mediaId,
    mediaType,
    mediaTitle,
    isOpen,
    onOpenChange
  });

  return (
    <DialogContent
      isMobile={isMobile}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      mediaId={mediaId}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      showRatingStep={showRatingStep}
      showSuccessAnimation={showSuccessAnimation}
      isComplete={isComplete}
      selectedStatus={selectedStatus}
      notes={notes}
      isAddingToLibrary={isAddingToLibrary}
      errorMessage={errorMessage}
      onStatusSelect={handleStatusSelect}
      onNotesChange={handleNotesChange}
      onAddToLibrary={handleAddToLibrary}
      onRatingComplete={handleRatingComplete}
      onViewLibrary={handleViewLibrary}
    />
  );
}
