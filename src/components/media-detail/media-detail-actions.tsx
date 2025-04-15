
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media-service";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const { toast } = useToast();

  const handleAddToLibrary = async () => {
    if (!media) return;

    setIsAddingToLibrary(true);
    try {
      await addMediaToLibrary(media, type);
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
  };

  return (
    <div className="flex justify-around py-4 px-2 bg-secondary/40 backdrop-blur-sm border-y border-border">
      <Button variant="ghost" size="sm" className="flex flex-col items-center" onClick={() => setIsLiked(!isLiked)}>
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span className="text-xs mt-1">J'aime</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex flex-col items-center"
        onClick={handleAddToLibrary}
        disabled={isAddingToLibrary}
      >
        {isAddingToLibrary ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <BookmarkPlus className="h-5 w-5" />
        )}
        <span className="text-xs mt-1">Ajouter</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex flex-col items-center"
        onClick={onAddToCollection}
      >
        <FolderPlus className="h-5 w-5" />
        <span className="text-xs mt-1">Collection</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex flex-col items-center">
        <Share className="h-5 w-5" />
        <span className="text-xs mt-1">Partager</span>
      </Button>
    </div>
  );
}
