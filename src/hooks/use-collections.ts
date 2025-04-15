
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getMyCollections, 
  getPublicCollections,
  createCollection
} from '@/services/collection-service';
import { Collection, CollectionType, CollectionVisibility } from '@/types/collection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCollections() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: myCollections = [], 
    isLoading: loadingMyCollections 
  } = useQuery({
    queryKey: ['collections', 'my'],
    queryFn: getMyCollections
  });

  const { 
    data: publicCollections = [], 
    isLoading: loadingPublicCollections 
  } = useQuery({
    queryKey: ['collections', 'public'],
    queryFn: getPublicCollections
  });

  const createCollectionMutation = useMutation({
    mutationFn: (collectionData: { 
      name: string;
      description?: string;
      type?: CollectionType;
      visibility?: CollectionVisibility;
    }) => createCollection(collectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', 'my'] });
      toast({
        title: "Collection créée",
        description: "Votre collection a été créée avec succès"
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la collection",
        variant: "destructive"
      });
    }
  });

  return {
    myCollections,
    publicCollections,
    loadingMyCollections,
    loadingPublicCollections,
    createCollection: createCollectionMutation.mutate,
    isCreatingCollection: createCollectionMutation.isPending
  };
}
