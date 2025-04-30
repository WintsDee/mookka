
import React from "react";
import { Dialog, DialogContent as UIDialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { StatusSelection } from "../status-selection";
import { getStatusOptions } from "../status-options";
import { SuccessState } from "../success-state";
import { MediaType, MediaStatus } from "@/types";
import { MediaRating } from "@/components/media-rating";

interface AddMediaDialogContentProps {
  isMobile: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  selectedStatus: MediaStatus | null;
  notes: string;
  isAddingToLibrary: boolean;
  isComplete: boolean;
  showSuccessAnimation: boolean;
  showRatingStep: boolean;
  onStatusSelect: (status: MediaStatus) => void;
  onNotesChange: (value: string) => void;
  onAddToLibrary: () => void;
  onRatingComplete: (rating?: number) => void;
  onViewLibrary: () => void;
}

export function DialogContent({
  isMobile,
  isOpen,
  onOpenChange,
  mediaId,
  mediaType,
  mediaTitle,
  selectedStatus,
  notes,
  isAddingToLibrary,
  isComplete,
  showSuccessAnimation,
  showRatingStep,
  onStatusSelect,
  onNotesChange,
  onAddToLibrary,
  onRatingComplete,
  onViewLibrary
}: AddMediaDialogContentProps) {
  // Get status options based on media type
  const filteredOptions = getStatusOptions(mediaType);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <UIDialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showRatingStep 
              ? "Noter ce média" 
              : isComplete 
                ? "Ajout terminé" 
                : "Ajouter à ma bibliothèque"}
          </DialogTitle>
          {!showRatingStep && !isComplete && (
            <DialogDescription>
              {isMobile 
                ? `Choisissez un statut pour "${mediaTitle}".` 
                : `Choisissez un statut pour ce média et ajoutez éventuellement des notes personnelles.`}
            </DialogDescription>
          )}
        </DialogHeader>

        {showRatingStep && (
          <MediaRating 
            mediaId={mediaId} 
            mediaType={mediaType}
            initialNotes={notes}
            onRatingComplete={onRatingComplete}
          />
        )}
        
        {!showRatingStep && !isComplete && (
          <StatusSelection 
            statusOptions={filteredOptions}
            selectedStatus={selectedStatus}
            notes={notes}
            mediaTitle={mediaTitle}
            isAddingToLibrary={isAddingToLibrary}
            onStatusSelect={onStatusSelect}
            onNotesChange={onNotesChange}
            onAddToLibrary={onAddToLibrary}
          />
        )}
        
        {(isComplete || showSuccessAnimation) && (
          <SuccessState 
            mediaTitle={mediaTitle}
            isComplete={isComplete}
            showSuccessAnimation={showSuccessAnimation}
            onViewLibrary={onViewLibrary}
          />
        )}
      </UIDialogContent>
    </Dialog>
  );
}
