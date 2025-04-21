
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddMediaDialog } from "./AddMediaDialog";
import { useProfile } from "@/hooks/use-profile";
import { useQueryClient } from "@tanstack/react-query";
import { removeMediaFromLibrary } from "@/services/media/operations";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useProfile();
  const queryClient = useQueryClient();

  // Détecte si le média est déjà dans la bibliothèque
  const isInLibrary = !!media.status;

  const handleAddToLibrary = useCallback(async () => {
    if (!media) return;

    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter un média à votre bibliothèque",
        variant: "destructive",
      });
      return;
    }

    setShowAddDialog(true);
  }, [media, isAuthenticated, toast]);

  const handleRemoveFromLibrary = useCallback(async () => {
    if (!media?.id) return;
    setIsRemoving(true);
    try {
      await removeMediaFromLibrary(media.id);
      toast({
        title: "Retiré de la bibliothèque",
        description: `"${media.title}" a été retiré de votre bibliothèque.`
      });
      // On rafraîchit les données du média + bibliothèque utilisateur
      queryClient.invalidateQueries({ queryKey: ['userMediaLibrary'] });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de retirer ce média",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  }, [media, toast, queryClient]);

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

  // Style moderne : surélevé, bouton principal coloré, autres ghost avec anim/hover
  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex justify-around py-3 px-3 mb-7 mx-4 rounded-2xl",
        "bg-background shadow-2xl border border-border/30 gap-2",
        "backdrop-blur-lg animate-fade-in"
      )}>
        <Button 
          variant={isLiked ? "default" : "ghost"} 
          size="icon" 
          className={cn(
            "transition h-12 w-12 rounded-xl text-lg",
            isLiked ? "bg-rose-600/90 text-white shadow-lg" : "hover:bg-rose-50"
          )}
          onClick={() => handleActionClick(() => setIsLiked(!isLiked))}
          aria-label="J'aime"
        >
          <Heart className={cn("h-6 w-6", isLiked && "fill-rose-500 text-rose-50")} />
        </Button>
        
        {!isInLibrary && (
          <Button 
            variant="default"
            size="lg"
            className="h-12 rounded-xl px-6 text-base font-bold shadow-lg transition hover:scale-105"
            onClick={handleAddToLibrary}
          >
            <BookmarkPlus className="h-5 w-5 mr-2" />
            Ajouter à ma bibliothèque
          </Button>
        )}
        
        {isInLibrary && (
          <Button
            variant="destructive"
            size="lg"
            className="h-12 rounded-xl px-6 text-base font-bold shadow-lg transition hover:scale-105 flex items-center gap-2"
            onClick={handleRemoveFromLibrary}
            disabled={isRemoving}
          >
            {isRemoving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash className="h-5 w-5" />}
            Retirer de ma bibliothèque
          </Button>
        )}

        <Button 
          variant="ghost" 
          size="icon"
          className="transition h-12 w-12 rounded-xl text-lg hover:bg-accent"
          onClick={() => handleActionClick(onAddToCollection)}
          aria-label="Ajouter à une collection"
        >
          <FolderPlus className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="transition h-12 w-12 rounded-xl text-lg hover:bg-accent"
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
          aria-label="Partager"
        >
          <Share className="h-6 w-6" />
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
