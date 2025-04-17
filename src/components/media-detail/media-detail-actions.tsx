
import React, { useState, useEffect, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MediaType } from "@/types";
import { addMediaToLibrary, removeMediaFromLibrary, isMediaInLibrary } from "@/services/media";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
  isInLibrary?: boolean;
  onLibraryChange?: () => void;
}

const MediaDetailActions = memo(({ 
  media, 
  type, 
  onAddToCollection, 
  isInLibrary = false,
  onLibraryChange
}: MediaDetailActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [isRemovingFromLibrary, setIsRemovingFromLibrary] = useState(false);
  const [inLibrary, setInLibrary] = useState(isInLibrary);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Vérifier si le média est dans la bibliothèque au chargement du composant avec mémorisation
  const checkLibraryStatus = useCallback(async () => {
    if (media && user) {
      try {
        const inUserLibrary = await isMediaInLibrary(media.id);
        setInLibrary(inUserLibrary);
      } catch (error) {
        console.error("Erreur lors de la vérification de la bibliothèque:", error);
      }
    }
  }, [media, user]);

  useEffect(() => {
    checkLibraryStatus();
  }, [checkLibraryStatus]);

  // Mettre à jour l'état lorsque la prop isInLibrary change
  useEffect(() => {
    setInLibrary(isInLibrary);
  }, [isInLibrary]);

  const handleAddToLibrary = useCallback(async () => {
    if (!media || !user) {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter un média à votre bibliothèque",
          variant: "destructive",
        });
      }
      return;
    }

    setIsAddingToLibrary(true);
    try {
      await addMediaToLibrary(media, type);
      
      setInLibrary(true);
      if (onLibraryChange) onLibraryChange();
      
      toast({
        title: "Succès",
        description: `${type === 'film' ? 'Le film' : type === 'serie' ? 'La série' : type === 'book' ? 'Le livre' : 'Le jeu'} a été ajouté à votre bibliothèque`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsAddingToLibrary(false);
    }
  }, [media, user, type, toast, onLibraryChange]);

  const handleRemoveFromLibrary = useCallback(async () => {
    if (!media || !user || !media.id) return;

    setIsRemovingFromLibrary(true);
    try {
      await removeMediaFromLibrary(media.id);
      
      setInLibrary(false);
      if (onLibraryChange) onLibraryChange();
      
      toast({
        title: "Succès",
        description: `${type === 'film' ? 'Le film' : type === 'serie' ? 'La série' : type === 'book' ? 'Le livre' : 'Le jeu'} a été retiré de votre bibliothèque`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer ce média de votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsRemovingFromLibrary(false);
    }
  }, [media, user, toast, type, onLibraryChange]);

  // Mémoriser ces composants pour éviter les re-rendus inutiles
  const ActionButton = memo(({ onClick, disabled, children, variant = "ghost", className = "" }) => (
    <Button 
      variant={variant} 
      size="sm" 
      className={`flex items-center gap-1.5 h-auto py-1.5 px-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  ));
  
  ActionButton.displayName = 'ActionButton';

  // Éviter les re-rendus inutiles pour les boutons d'action
  const renderActionButtons = useCallback(() => {
    return (
      <>
        <ActionButton onClick={() => setIsLiked(!isLiked)}>
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">J'aime</span>
        </ActionButton>
        
        {inLibrary ? (
          <ActionButton 
            onClick={handleRemoveFromLibrary}
            disabled={isRemovingFromLibrary || !user}
            className="text-destructive"
          >
            {isRemovingFromLibrary ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="text-xs">Retirer</span>
          </ActionButton>
        ) : (
          <ActionButton 
            onClick={handleAddToLibrary}
            disabled={isAddingToLibrary || !user}
          >
            {isAddingToLibrary ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
            <span className="text-xs">Ajouter</span>
          </ActionButton>
        )}
        
        <ActionButton 
          onClick={onAddToCollection}
          disabled={!user}
        >
          <FolderPlus className="h-4 w-4" />
          <span className="text-xs">Collection</span>
        </ActionButton>
        
        <ActionButton>
          <Share className="h-4 w-4" />
          <span className="text-xs">Partager</span>
        </ActionButton>
      </>
    );
  }, [isLiked, inLibrary, isRemovingFromLibrary, user, handleRemoveFromLibrary, isAddingToLibrary, handleAddToLibrary, onAddToCollection]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-20 flex justify-around py-2 px-2 mb-6 mx-3 rounded-xl",
      "bg-background/40 backdrop-blur-md",
      "pb-safe-area", // Ajout de padding au bas de l'écran
      "py-4", // Augmentation du padding vertical
      "border border-border/20 shadow-lg" // Ajout d'une bordure subtile
    )}>
      {renderActionButtons()}
    </div>
  );
});

MediaDetailActions.displayName = "MediaDetailActions";

export { MediaDetailActions };
