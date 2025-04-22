import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaRating } from "@/hooks/use-media-rating";
import { MediaRating } from "@/components/media-rating";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaType, MediaStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotesTextarea } from "./progression/notes-textarea";
import { addMediaToLibrary } from "@/services/media-service";
import { Check, Loader2 } from "lucide-react";

interface AddMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

type StatusOption = {
  value: MediaStatus;
  label: string;
  description: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

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
  
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setNotes("");
      setShowRatingStep(false);
      setIsComplete(false);
      setIsAddingToLibrary(false);
      setShowSuccessAnimation(false);
    }
  }, [isOpen]);
  
  const getStatusOptions = (type: MediaType): StatusOption[] => {
    switch (type) {
      case 'film':
        return [
          { 
            value: 'to-watch', 
            label: 'À voir', 
            description: 'Films que vous prévoyez de regarder',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-500/30'
          },
          { 
            value: 'watching', 
            label: 'En cours', 
            description: 'Films que vous êtes en train de regarder',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
          },
          { 
            value: 'completed', 
            label: 'Vu', 
            description: 'Films que vous avez terminés',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
          }
        ];
      case 'serie':
        return [
          { 
            value: 'to-watch', 
            label: 'À voir', 
            description: 'Séries que vous prévoyez de regarder',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-500/30'
          },
          { 
            value: 'watching', 
            label: 'En cours', 
            description: 'Séries que vous êtes en train de regarder',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
          },
          { 
            value: 'completed', 
            label: 'Terminée', 
            description: 'Séries que vous avez terminées',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
          }
        ];
      case 'book':
        return [
          { 
            value: 'to-read', 
            label: 'À lire', 
            description: 'Livres que vous prévoyez de lire',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-500/30'
          },
          { 
            value: 'reading', 
            label: 'En cours', 
            description: 'Livres que vous êtes en train de lire',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
          },
          { 
            value: 'completed', 
            label: 'Lu', 
            description: 'Livres que vous avez terminés',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
          }
        ];
      case 'game':
        return [
          { 
            value: 'to-play', 
            label: 'À jouer', 
            description: 'Jeux auxquels vous prévoyez de jouer',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-500/30'
          },
          { 
            value: 'playing', 
            label: 'En cours', 
            description: 'Jeux auxquels vous jouez actuellement',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
          },
          { 
            value: 'completed', 
            label: 'Terminé', 
            description: 'Jeux que vous avez terminés',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
          }
        ];
      default:
        return [
          { 
            value: 'to-watch', 
            label: 'À faire', 
            description: 'Médias à consommer plus tard',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-500/30'
          },
          { 
            value: 'watching', 
            label: 'En cours', 
            description: 'Médias en cours',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-300',
            borderColor: 'border-purple-500/30'
          },
          { 
            value: 'completed', 
            label: 'Terminé', 
            description: 'Médias terminés',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-500/30'
          }
        ];
    }
  };
  
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
      if (selectedStatus === 'completed') {
        setShowRatingStep(true);
        setIsAddingToLibrary(false);
        return;
      }
      
      await addMediaToLibrary(
        { id: mediaId, title: mediaTitle },
        mediaType,
        selectedStatus,
        notes
      );
      
      setShowSuccessAnimation(true);
      
      toast({
        title: "Média ajouté",
        description: `"${mediaTitle}" a été ajouté à votre bibliothèque."
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
  
  const handleRatingComplete = () => {
    setShowRatingStep(false);
    setShowSuccessAnimation(true);
    
    toast({
      title: "Média ajouté",
      description: `"${mediaTitle}" a été ajouté à votre bibliothèque avec succès."
    });
    
    setTimeout(() => {
      setIsComplete(true);
      
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }, 1000);
  };
  
  const handleViewLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };
  
  const renderContent = () => {
    if (showSuccessAnimation || isComplete) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4 animate-scale-in">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2 animate-fade-in">Média ajouté avec succès</h3>
          <p className="text-muted-foreground mb-6 animate-fade-in">
            "{mediaTitle}" a été ajouté à votre bibliothèque.
          </p>
          {isComplete && (
            <div className="animate-fade-in">
              <Button onClick={handleViewLibrary}>
                Voir ma bibliothèque
              </Button>
            </div>
          )}
        </div>
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
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-colors
                  ${selectedStatus === option.value 
                    ? `${option.bgColor} ${option.textColor} ${option.borderColor}` 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'}
                `}
                onClick={() => handleStatusSelect(option.value)}
              >
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <NotesTextarea 
          notes={notes} 
          onNotesChange={handleNotesChange}
          placeholder={`Vos notes personnelles sur ${mediaTitle}...`}
        />
        
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleAddToLibrary} 
            disabled={!selectedStatus || isAddingToLibrary}
          >
            {isAddingToLibrary ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              selectedStatus === 'completed' 
                ? 'Continuer vers la notation' 
                : 'Ajouter à ma bibliothèque'
            )}
          </Button>
        </div>
      </div>
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
