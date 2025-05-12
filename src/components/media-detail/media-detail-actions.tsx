
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MediaType } from "@/types";
import { ArrowLeft, PlusCircle, BookOpen, Film, Gamepad, Tv2 as Tv, Folder, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddMediaDialog } from "./dialog/add-media";
import { useToast } from "@/hooks/use-toast";
import { StatusDropdown } from "./status-dropdown";
import { Badge } from "@/components/ui/badge";
import { removeMediaFromLibrary, updateMediaStatus } from "@/services/media";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { useMediaRating } from "@/hooks/use-media-rating";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection?: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();
  const { userMediaStatus } = useMediaRating(media.id, type);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addCollectionDialogOpen, setAddCollectionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  
  // Check if media is in user's library
  useEffect(() => {
    setIsInLibrary(userMediaStatus !== null);
  }, [userMediaStatus]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleDeleteMedia = async () => {
    if (!media.id) return;
    
    setIsDeleting(true);
    try {
      await removeMediaFromLibrary(media.id);
      toast({ 
        title: "Média supprimé", 
        description: "Le média a été supprimé de votre bibliothèque" 
      });
      navigate("/bibliotheque");
    } catch (error) {
      console.error("Erreur lors de la suppression du média:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce média",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleAddToCollection = async (collectionId: string) => {
    if (!media.id) return;
    
    addMediaToCollection({ collectionId, mediaId: media.id });
    setAddCollectionDialogOpen(false);
  };

  const TypeIcon = () => {
    switch (type) {
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "film":
        return <Film className="h-5 w-5" />;
      case "serie":
        return <Tv className="h-5 w-5" />;
      case "game":
        return <Gamepad className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 px-4 py-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-safe">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Status dropdown - only shown for media in library */}
            {isInLibrary && (
              <StatusDropdown
                mediaId={media.id}
                mediaType={type}
                currentStatus={userMediaStatus}
                isInLibrary={isInLibrary}
                size="sm"
              />
            )}
            
            {/* Bouton pour les collections */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setAddCollectionDialogOpen(true)}
            >
              <Folder className="h-5 w-5" />
            </Button>
            
            {/* Bouton pour supprimer de la bibliothèque - only shown for media in library */}
            {isInLibrary && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-full"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            
            {/* Bouton principal pour ajouter à la bibliothèque - only shown if not in library */}
            {!isInLibrary && (
              <Button onClick={() => setAddDialogOpen(true)} className="gap-2 rounded-full">
                <TypeIcon />
                {isMobile ? "Ajouter" : "Ajouter à ma bibliothèque"}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AddMediaDialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mediaId={media.id}
        mediaType={type}
        mediaTitle={media.title}
      />
      
      <AddToCollectionDialog
        open={addCollectionDialogOpen}
        onOpenChange={setAddCollectionDialogOpen}
        mediaId={media.id}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer de ma bibliothèque</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{media.title}" de votre bibliothèque ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMedia}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
