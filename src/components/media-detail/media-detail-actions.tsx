
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddMediaDialog } from "./AddMediaDialog";
import { useProfile } from "@/hooks/use-profile";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useProfile();

  const handleAddToLibrary = useCallback(async () => {
    if (!media) return;

    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter un média à votre bibliothèque",
        variant: "destructive",
      });
      return;
    }

    // Afficher le dialogue d'ajout
    setShowAddDialog(true);
  }, [media, isAuthenticated, toast]);

  const handleActionClick = useCallback((action: () => void) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }
    action();
  }, [isAuthenticated, toast]);

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-20 flex justify-around py-2 px-2 mb-6 mx-3 rounded-xl",
        "bg-background/40 backdrop-blur-md",
        "pb-safe-area",
        "py-4",
        "border border-border/20 shadow-lg"
      )}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={() => handleActionClick(() => setIsLiked(!isLiked))}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">J'aime</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={handleAddToLibrary}
        >
          <BookmarkPlus className="h-4 w-4" />
          <span className="text-xs">Ajouter</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={() => handleActionClick(onAddToCollection)}
        >
          <FolderPlus className="h-4 w-4" />
          <span className="text-xs">Collection</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={() => handleActionClick(() => {
            navigator.share && navigator.share({
              title: media.title,
              text: `Découvrez ${media.title} sur Mookka !`,
              url: window.location.href,
            }).catch(() => {
              toast({
                title: "Partage",
                description: "URL copiée dans le presse-papier",
              });
              navigator.clipboard.writeText(window.location.href);
            });
          })}
        >
          <Share className="h-4 w-4" />
          <span className="text-xs">Partager</span>
        </Button>
      </div>

      <AddMediaDialog
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        mediaId={media.id}
        mediaType={type}
        mediaTitle={media.title || media.name}
      />
    </>
  );
}
