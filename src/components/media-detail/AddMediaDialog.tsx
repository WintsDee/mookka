
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { MediaRating } from "@/components/media-rating";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addMediaToLibrary } from "@/services/media";
import { AddMediaDialogProps } from "./dialog/types";
import { getStatusOptions } from "./dialog/status-options";
import { StatusSelection } from "./dialog/status-selection";
import { SuccessState } from "./dialog/success-state";

export function AddMediaDialog({ 
  isOpen, 
  onOpenChange, 
  mediaId,
  mediaType,
  mediaTitle 
}: AddMediaDialogProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showRatingStep, setShowRatingStep] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Réinitialiser l'état lorsque la boîte de dialogue est ouverte
      setSelectedStatus(null);
      setNotes("");
      setShowRatingStep(false);
      setIsComplete(false);
      setIsAddingToLibrary(false);
      setShowSuccessAnimation(false);
      setUserRating(null);
    }
  }, [isOpen]);
  
  const statusOptions = getStatusOptions(mediaType);
  
  const handleStatusSelect = (status: MediaStatus) => {
    setSelectedStatus(status);
  };
  
  const handleNotesChange = (value: string) => {
    setNotes(value);
  };
  
  const handleAddToLibrary = async () => {
    if (!selectedStatus) return;
    
    setIsAddingToLibrary(true);
    
    try {
      // Cas spécial pour le statut "completed"
      if (selectedStatus === 'completed') {
        // Important: d'abord désactiver l'indicateur d'ajout avant d'afficher l'étape de notation
        setIsAddingToLibrary(false);
        setShowRatingStep(true);
        return;
      }
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: selectedStatus,
        notes
      });
      
      setShowSuccessAnimation(true);
      
      toast({
        title: "Média ajouté",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque.`
      });
      
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
      setIsAddingToLibrary(false);
    }
  };
  
  const handleRatingComplete = async (rating?: number) => {
    if (rating) {
      setUserRating(rating);
    }
    
    try {
      // Ajout du média avec statut "completed" et la note attribuée
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes,
        rating: rating || undefined
      });
      
      setShowRatingStep(false);
      setShowSuccessAnimation(true);
      
      toast({
        title: "Média ajouté",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque avec succès.`
      });
      
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du média noté:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
    }
  };
  
  const handleViewLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };
  
  const renderContent = () => {
    if (showSuccessAnimation || isComplete) {
      return (
        <SuccessState 
          mediaTitle={mediaTitle}
          isComplete={isComplete}
          onViewLibrary={handleViewLibrary}
        />
      );
    }
    
    if (showRatingStep) {
      return (
        <MediaRating 
          mediaId={mediaId} 
          mediaType={mediaType} 
          initialNotes={notes}
          onRatingComplete={handleRatingComplete}
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
        onStatusSelect={handleStatusSelect}
        onNotesChange={handleNotesChange}
        onAddToLibrary={handleAddToLibrary}
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
      <DialogContent className="max-w-lg">
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
      </DialogContent>
    </Dialog>
  );
}
