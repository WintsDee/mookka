import React, { memo, useCallback, useEffect, useState } from "react";
import { Share2, Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addMediaToLibrary, removeMediaFromLibrary, isMediaInLibrary } from "@/services/media";
import { useAuth } from "@/providers/auth-provider";
import { MediaType } from "@/types";
import { cn } from "@/lib/utils";

interface MediaDetailActionsProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  className?: string;
  onLibraryChange?: () => void;
}

// Memoizing the component for better performance
const MediaDetailActions = memo(({
  mediaId,
  mediaType,
  mediaTitle,
  className,
  onLibraryChange
}: MediaDetailActionsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  // Fetch the initial status when the component mounts
  useEffect(() => {
    const checkLibraryStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const inLibrary = await isMediaInLibrary(mediaId);
        setIsInLibrary(inLibrary);
      } catch (error) {
        console.error("Erreur lors de la vérification de la bibliothèque:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLibraryStatus();
  }, [mediaId, user]);

  // Add to library handler with useCallback for memoization
  const handleAddToLibrary = useCallback(async () => {
    if (!user) {
      toast({
        title: "Action requise",
        description: "Vous devez être connecté pour ajouter des médias à votre bibliothèque",
        variant: "destructive"
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: "to_consume" // Status par défaut
      });
      
      setIsInLibrary(true);
      toast({
        title: "Ajouté à la bibliothèque",
        description: `${mediaTitle} a été ajouté à votre bibliothèque`
      });
      if (onLibraryChange) onLibraryChange();
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  }, [mediaId, mediaType, mediaTitle, toast, user, onLibraryChange]);

  // Remove from library handler with useCallback for memoization
  const handleRemoveFromLibrary = useCallback(async () => {
    if (!user) return;
    
    setIsRemoving(true);
    
    try {
      await removeMediaFromLibrary(mediaId);
      
      setIsInLibrary(false);
      toast({
        title: "Supprimé de la bibliothèque",
        description: `${mediaTitle} a été supprimé de votre bibliothèque`
      });
      if (onLibraryChange) onLibraryChange();
    } catch (error) {
      console.error("Erreur lors de la suppression de la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce média de votre bibliothèque",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  }, [mediaId, mediaTitle, toast, user, onLibraryChange]);

  // Optimized action button with TypeScript fixes
  const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined 
  }> = ({ onClick, disabled, children, variant, className }) => (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant || "outline"}
      size="sm"
      className={cn("text-xs", className)}
    >
      {isLoading ? (
        <AlertCircle className="mr-1 h-3 w-3 animate-pulse" />
      ) : (
        children
      )}
    </Button>
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ActionButton onClick={() => {}}>
        <Share2 className="mr-1 h-3 w-3" />
        Partager
      </ActionButton>
      
      {isInLibrary ? (
        <ActionButton 
          onClick={handleRemoveFromLibrary}
          disabled={isRemoving}
          className="text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <X className="mr-1 h-3 w-3" />
          Retirer
        </ActionButton>
      ) : (
        <ActionButton
          onClick={handleAddToLibrary}
          disabled={isAdding}
          className={`text-media-${mediaType} border-media-${mediaType}/30 hover:bg-media-${mediaType}/10`}
        >
          <Plus className="mr-1 h-3 w-3" />
          Ajouter
        </ActionButton>
      )}
    </div>
  );
});

MediaDetailActions.displayName = "MediaDetailActions";

export { MediaDetailActions };
