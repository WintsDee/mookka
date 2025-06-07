
import { useState } from 'react';
import { 
  getMyCollections, 
  getPublicCollections,
  getFollowedCollections,
  createCollection,
  addMediaToCollection,
  getCollectionsForMedia
} from '@/services/collection-service';
import { Collection, CollectionType, CollectionVisibility } from '@/types/collection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/hooks/use-profile';

export function useCollections() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useProfile();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { 
    data: myCollections = [], 
    isLoading: loadingMyCollections,
    error: myCollectionsError 
  } = useQuery({
    queryKey: ['collections', 'my'],
    queryFn: getMyCollections,
    enabled: isAuthenticated,
    retry: 2
  });

  const { 
    data: publicCollections = [], 
    isLoading: loadingPublicCollections,
    error: publicCollectionsError 
  } = useQuery({
    queryKey: ['collections', 'public'],
    queryFn: getPublicCollections,
    retry: 2
  });
  
  const { 
    data: followedCollections = [], 
    isLoading: loadingFollowedCollections,
    error: followedCollectionsError 
  } = useQuery({
    queryKey: ['collections', 'followed'],
    queryFn: getFollowedCollections,
    enabled: isAuthenticated,
    retry: 2
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
      setShowSuccessAnimation(true);
    },
    onError: (error: any) => {
      console.error('Error creating collection:', error);
    }
  });
  
  const addToCollectionMutation = useMutation({
    mutationFn: ({ collectionId, mediaId }: { collectionId: string; mediaId: string }) => {
      console.log('Adding media to collection:', { collectionId, mediaId });
      return addMediaToCollection(collectionId, mediaId);
    },
    onSuccess: (data, variables) => {
      console.log('Successfully added to collection:', data);
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['media-collections', variables.mediaId] });
      setShowSuccessAnimation(true);
    },
    onError: (error: any) => {
      console.error('Error adding to collection:', error);
    }
  });
  
  const getCollectionsContainingMedia = async (mediaId: string) => {
    if (!mediaId) return [];
    try {
      console.log('Getting collections for media:', mediaId);
      const collections = await getCollectionsForMedia(mediaId);
      console.log('Collections found:', collections);
      return collections;
    } catch (error) {
      console.error('Error getting collections for media:', error);
      return [];
    }
  };

  return {
    myCollections,
    publicCollections,
    followedCollections,
    loadingMyCollections,
    loadingPublicCollections,
    loadingFollowedCollections,
    collectionsError: myCollectionsError || publicCollectionsError || followedCollectionsError,
    createCollection: createCollectionMutation.mutate,
    isCreatingCollection: createCollectionMutation.isPending,
    addMediaToCollection: addToCollectionMutation.mutate,
    isAddingToCollection: addToCollectionMutation.isPending,
    getCollectionsContainingMedia,
    showSuccessAnimation,
    hideSuccessAnimation: () => setShowSuccessAnimation(false)
  };
}
