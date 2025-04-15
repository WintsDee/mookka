
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collection } from '@/types/collection';
import { Badge } from '@/components/ui/badge';
import { getCollectionsForMedia, addMediaToCollection } from '@/services/collection-service';
import { AddToCollectionDialog } from '@/components/collections/add-to-collection-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Folder } from 'lucide-react';

interface MediaCollectionsSectionProps {
  mediaId: string;
}

export function MediaCollectionsSection({ mediaId }: MediaCollectionsSectionProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCollections = async () => {
      if (!mediaId) return;
      
      setLoading(true);
      try {
        const data = await getCollectionsForMedia(mediaId);
        setCollections(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des collections:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollections();
  }, [mediaId]);
  
  const handleAddToCollection = async (collectionId: string) => {
    setIsAddingToCollection(true);
    try {
      await addMediaToCollection(collectionId, mediaId);
      
      // Mettre à jour la liste des collections
      const updatedCollections = await getCollectionsForMedia(mediaId);
      setCollections(updatedCollections);
      
      setDialogOpen(false);
      toast({
        title: "Média ajouté",
        description: "Le média a été ajouté à la collection"
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du média à la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à la collection",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCollection(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">
          Collections ({collections.length})
        </h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={16} className="mr-1" />
          Ajouter
        </Button>
      </div>
      
      {collections.length === 0 ? (
        <div className="bg-muted/40 rounded-md p-4 text-center">
          <Folder className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Ce média n'est présent dans aucune collection.
          </p>
          <Button 
            variant="link" 
            className="mt-1 h-auto p-0"
            onClick={() => setDialogOpen(true)}
          >
            Ajouter à une collection
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {collections.map(collection => (
            <Link key={collection.id} to={`/collections/${collection.id}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary">
                {collection.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
      
      <AddToCollectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mediaId={mediaId}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
    </div>
  );
}
