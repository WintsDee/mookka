
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddMediaDialog } from "./AddMediaDialog";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { removeMediaFromLibrary } from "@/services/media";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useProfile();

  // Vérifier si le média est déjà dans la bibliothèque de l'utilisateur
  useEffect(() => {
    const checkIfInLibrary = async () => {
      if (!media || !isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('user_media')
          .select('id')
          .eq('user_id', user.user.id)
          .eq('media_id', media.id)
          .maybeSingle();
          
        if (error) {
          console.error("Erreur lors de la vérification de la bibliothèque:", error);
          throw error;
        }
        
        setIsInLibrary(!!data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfInLibrary();
  }, [media, isAuthenticated]);

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

  const handleRemoveFromLibrary = useCallback(async () => {
    if (!media || !isAuthenticated) return;

    try {
      setIsRemoving(true);
      await removeMediaFromLibrary(media.id);
      
      setIsInLibrary(false);
      toast({
        title: "Média supprimé",
        description: "Le média a été retiré de votre bibliothèque",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce média de votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
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

  // Quand le dialogue d'ajout se ferme, vérifier si le média a été ajouté
  const handleAddDialogClose = (open: boolean) => {
    setShowAddDialog(open);
    if (!open) {
      // Attendre un peu avant de vérifier, pour laisser le temps à la base de données
      setTimeout(() => {
        const checkIfInLibrary = async () => {
          try {
            const { data: user } = await supabase.auth.getUser();
            
            if (!user.user) return;
            
            const { data } = await supabase
              .from('user_media')
              .select('id')
              .eq('user_id', user.user.id)
              .eq('media_id', media.id)
              .maybeSingle();
              
            setIsInLibrary(!!data);
          } catch (error) {
            console.error("Erreur:", error);
          }
        };
        
        checkIfInLibrary();
      }, 500);
    }
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-20 flex justify-around items-center py-3 px-3 mb-6 mx-3 rounded-xl",
        "bg-card/80 backdrop-blur-md",
        "pb-safe-area",
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
        
        {!isInLibrary ? (
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-1.5 h-auto py-1.5 px-4 ml-auto"
            onClick={handleAddToLibrary}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
            <span className="text-xs font-medium">Ajouter</span>
          </Button>
        ) : (
          <>
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
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1.5 h-auto py-1.5 px-3 ml-auto"
              onClick={() => handleActionClick(handleRemoveFromLibrary)}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="text-xs">Supprimer</span>
            </Button>
          </>
        )}
        
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
        onOpenChange={handleAddDialogClose}
        mediaId={media.id}
        mediaType={type}
        mediaTitle={media.title || media.name}
      />
    </>
  );
}
