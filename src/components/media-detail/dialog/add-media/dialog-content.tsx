
import { Dialog, DialogContent as UIDialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { MediaRating } from "@/components/media-rating";
import { MediaType, MediaStatus } from "@/types";
import { StatusSelection } from "../status-selection";
import { SuccessState } from "../success-state";
import { getStatusOptions } from "../status-options";

interface DialogContentProps {
  isMobile: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  showRatingStep: boolean;
  showSuccessAnimation: boolean;
  isComplete: boolean;
  selectedStatus: MediaStatus | null;
  notes: string;
  isAddingToLibrary: boolean;
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
  showRatingStep,
  showSuccessAnimation,
  isComplete,
  selectedStatus,
  notes,
  isAddingToLibrary,
  onStatusSelect,
  onNotesChange,
  onAddToLibrary,
  onRatingComplete,
  onViewLibrary
}: DialogContentProps) {
  const statusOptions = getStatusOptions(mediaType);

  const renderContent = () => {
    if (showSuccessAnimation || isComplete) {
      return (
        <SuccessState 
          mediaTitle={mediaTitle}
          isComplete={isComplete}
          onViewLibrary={onViewLibrary}
        />
      );
    }
    
    if (showRatingStep) {
      return (
        <MediaRating 
          mediaId={mediaId} 
          mediaType={mediaType} 
          initialNotes={notes}
          onRatingComplete={onRatingComplete}
        />
      );
    }
    
    return (
      <StatusSelection
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        notes={notes}
        mediaTitle={mediaTitle}
        isAddingToLibrary={isAddingToLibrary}
        onStatusSelect={onStatusSelect}
        onNotesChange={onNotesChange}
        onAddToLibrary={onAddToLibrary}
      />
    );
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {showRatingStep 
                ? `Noter "${mediaTitle}"`
                : `Ajouter "${mediaTitle}" à votre bibliothèque`}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <UIDialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {showRatingStep 
              ? `Noter "${mediaTitle}"`
              : `Ajouter "${mediaTitle}" à votre bibliothèque`}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </UIDialogContent>
    </Dialog>
  );
}
