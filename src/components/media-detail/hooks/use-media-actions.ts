
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MediaType } from "@/types";
import { removeMediaFromLibrary } from "@/services/media";
import { useToast } from "@/hooks/use-toast";
import { useCollections } from "@/hooks/use-collections";
import { useMediaRating } from "@/hooks/use-media-rating";

export interface UseMediaActionsProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export function useMediaActions({ mediaId, mediaType, mediaTitle }: UseMediaActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addMediaToCollection, isAddingToCollection } = useCollections();
  const { userMediaStatus } = useMediaRating(mediaId, mediaType);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addCollectionDialogOpen, setAddCollectionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);

  // Check if media is in user's library based on userMediaStatus
  useEffect(() => {
    const isInLib = userMediaStatus !== null;
    setIsInLibrary(isInLib);
  }, [userMediaStatus]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteMedia = async () => {
    if (!mediaId) return;
    
    setIsDeleting(true);
    try {
      await removeMediaFromLibrary(mediaId);
      toast({ 
        title: "Média supprimé", 
        description: "Le média a été supprimé de votre bibliothèque" 
      });
      
      // Update local state
      setIsInLibrary(false);
      
      // Optionally navigate to library
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
    if (!mediaId) return;
    try {
      await addMediaToCollection({ collectionId, mediaId });
      toast({
        title: "Succès",
        description: "Média ajouté à la collection"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à la collection",
        variant: "destructive",
      });
    }
    setAddCollectionDialogOpen(false);
  };

  return {
    isInLibrary,
    setIsInLibrary,
    addDialogOpen,
    setAddDialogOpen,
    addCollectionDialogOpen,
    setAddCollectionDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    isAddingToCollection,
    handleGoBack,
    handleDeleteMedia,
    handleAddToCollection,
    userMediaStatus
  };
}
