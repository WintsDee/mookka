
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collection } from '@/types/collection';
import { Plus, Check, Loader2 } from 'lucide-react';
import { useCollections } from '@/hooks/use-collections';
import { CreateCollectionDialog } from './create-collection-dialog';

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  onAddToCollection: (collectionId: string) => void;
  isAddingToCollection?: boolean;
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  mediaId,
  onAddToCollection,
  isAddingToCollection = false
}: AddToCollectionDialogProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [existingCollections, setExistingCollections] = useState<Set<string>>(new Set());
  
  const { 
    myCollections, 
    loadingMyCollections, 
    getCollectionsContainingMedia,
    createCollection,
    isCreatingCollection
  } = useCollections();

  // Récupérer les collections qui contiennent déjà ce média
  useEffect(() => {
    const fetchCollections = async () => {
      if (mediaId && open) {
        const collections = await getCollectionsContainingMedia(mediaId);
        setExistingCollections(new Set(collections.map(c => c.id)));
      }
    };
    
    fetchCollections();
  }, [mediaId, open, getCollectionsContainingMedia]);

  const handleAddToCollection = () => {
    if (selectedCollectionId) {
      onAddToCollection(selectedCollectionId);
    }
  };

  const handleCreateCollection = (data: any) => {
    createCollection({
      ...data,
      coverImage: undefined
    });
    setCreateDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter à une collection</DialogTitle>
          </DialogHeader>
          
          {loadingMyCollections ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {myCollections.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Vous n'avez pas encore créé de collection.
                    </p>
                  ) : (
                    myCollections.map(collection => {
                      const isInCollection = existingCollections.has(collection.id);
                      return (
                        <div
                          key={collection.id}
                          className={`
                            flex items-center justify-between p-3 rounded-md cursor-pointer
                            ${isInCollection 
                              ? 'bg-primary/10 text-primary' 
                              : selectedCollectionId === collection.id 
                                ? 'bg-accent text-accent-foreground' 
                                : 'hover:bg-accent/50'
                            }
                          `}
                          onClick={() => {
                            if (!isInCollection) {
                              setSelectedCollectionId(
                                selectedCollectionId === collection.id ? null : collection.id
                              );
                            }
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{collection.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {collection.itemCount} éléments
                            </span>
                          </div>
                          {isInCollection ? (
                            <Check className="h-5 w-5 text-primary" />
                          ) : selectedCollectionId === collection.id ? (
                            <Check className="h-5 w-5" />
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
              
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une nouvelle collection
              </Button>
              
              <DialogFooter>
                <Button 
                  onClick={() => onOpenChange(false)} 
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddToCollection} 
                  disabled={!selectedCollectionId || isAddingToCollection}
                >
                  {isAddingToCollection ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    'Ajouter'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <CreateCollectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCollection}
        isLoading={isCreatingCollection}
      />
    </>
  );
}
