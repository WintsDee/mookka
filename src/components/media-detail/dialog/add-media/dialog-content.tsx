
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

  // Déterminer le titre du dialogue en fonction de l'étape actuelle
  const getDialogTitle = () => {
    if (showRatingStep) {
      return `Noter "${mediaTitle}"`;
    }
    if (showSuccessAnimation || isComplete) {
      return "Média ajouté";
    }
    return `Ajouter "${mediaTitle}" à votre bibliothèque`;
  };

  const renderContent = () => {
    // Si nous sommes à l'étape du succès ou de fin
    if (showSuccessAnimation || isComplete) {
      return (
        <SuccessState 
          mediaTitle={mediaTitle}
          isComplete={isComplete}
          onViewLibrary={onViewLibrary}
        />
      );
    }
    
    // Si nous sommes à l'étape de notation
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
    
    // Sinon, nous sommes à l'étape de sélection du statut
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

  // Utiliser un composant Drawer sur mobile
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{getDialogTitle()}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Utiliser un Dialog sur desktop
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <UIDialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </UIDialogContent>
    </Dialog>
  );
}
