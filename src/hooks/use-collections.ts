
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getMyCollections, 
  getPublicCollections, 
  getFollowedCollections, 
  createCollection,
  addMediaToCollection,
  removeMediaFromCollection,
  followCollection,
  unfollowCollection,
  getCollectionsForMedia
} from '@/services/collection-service';
import { Collection, CollectionType, CollectionVisibility } from '@/types/collection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCollections() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Requêtes pour récupérer les collections
  const { 
    data: myCollections = [], 
    isLoading: loadingMyCollections, 
    error: myCollectionsError,
    refetch: refetchMyCollections
  } = useQuery({
    queryKey: ['collections', 'my'],
    queryFn: getMyCollections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { 
    data: publicCollections = [], 
    isLoading: loadingPublicCollections,
    error: publicCollectionsError,
    refetch: refetchPublicCollections
  } = useQuery({
    queryKey: ['collections', 'public'],
    queryFn: getPublicCollections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { 
    data: followedCollections = [], 
    isLoading: loadingFollowedCollections,
    error: followedCollectionsError,
    refetch: refetchFollowedCollections
  } = useQuery({
    queryKey: ['collections', 'followed'],
    queryFn: getFollowedCollections,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation pour créer une collection
  const createCollectionMutation = useMutation({
    mutationFn: (collectionData: { 
      name: string;
      description?: string;
      coverImage?: string;
      type: CollectionType;
      visibility: CollectionVisibility;
    }) => createCollection(collectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', 'my'] });
      toast({
        title: "Collection créée",
        description: "Votre collection a été créée avec succès",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer cette collection",
        variant: "destructive",
      });
    }
  });

  // Mutation pour ajouter un média à une collection
  const addToCollectionMutation = useMutation({
    mutationFn: ({ collectionId, mediaId }: { collectionId: string; mediaId: string }) => 
      addMediaToCollection(collectionId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Média ajouté",
        description: "Le média a été ajouté à la collection",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du média à la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à la collection",
        variant: "destructive",
      });
    }
  });

  // Mutation pour retirer un média d'une collection
  const removeFromCollectionMutation = useMutation({
    mutationFn: ({ collectionId, mediaId }: { collectionId: string; mediaId: string }) => 
      removeMediaFromCollection(collectionId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Média retiré",
        description: "Le média a été retiré de la collection",
      });
    },
    onError: (error) => {
      console.error("Erreur lors du retrait du média de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer ce média de la collection",
        variant: "destructive",
      });
    }
  });

  // Mutation pour suivre une collection
  const followCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => followCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', 'followed'] });
      toast({
        title: "Collection suivie",
        description: "Vous suivez maintenant cette collection",
      });
    },
    onError: (error) => {
      console.error("Erreur lors du suivi de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible de suivre cette collection",
        variant: "destructive",
      });
    }
  });

  // Mutation pour ne plus suivre une collection
  const unfollowCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => unfollowCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections', 'followed'] });
      toast({
        title: "Collection non suivie",
        description: "Vous ne suivez plus cette collection",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'arrêt du suivi de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter de suivre cette collection",
        variant: "destructive",
      });
    }
  });

  // Fonction pour récupérer les collections contenant un média
  const getCollectionsContainingMedia = async (mediaId: string) => {
    try {
      return await getCollectionsForMedia(mediaId);
    } catch (error) {
      console.error("Erreur lors de la récupération des collections contenant ce média:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les collections pour ce média",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    // Collections
    myCollections,
    publicCollections,
    followedCollections,
    
    // Loading states
    loadingMyCollections,
    loadingPublicCollections,
    loadingFollowedCollections,
    
    // Errors
    myCollectionsError,
    publicCollectionsError,
    followedCollectionsError,
    
    // Refetch
    refetchMyCollections,
    refetchPublicCollections,
    refetchFollowedCollections,
    
    // Mutations
    createCollection: createCollectionMutation.mutate,
    isCreatingCollection: createCollectionMutation.isPending,

    addMediaToCollection: addToCollectionMutation.mutate,
    isAddingToCollection: addToCollectionMutation.isPending,

    removeMediaFromCollection: removeFromCollectionMutation.mutate,
    isRemovingFromCollection: removeFromCollectionMutation.isPending,

    followCollection: followCollectionMutation.mutate,
    isFollowingCollection: followCollectionMutation.isPending,

    unfollowCollection: unfollowCollectionMutation.mutate,
    isUnfollowingCollection: unfollowCollectionMutation.isPending,
    
    // Utility functions
    getCollectionsContainingMedia
  };
}
