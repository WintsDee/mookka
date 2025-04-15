
import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/types/collection";
import { Media, MediaType } from "@/types";
import { mapCollectionFromDB, CollectionData } from "./collection-types";

export async function getCollectionById(id: string): Promise<Collection | null> {
  try {
    // Fetch the collection
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select(`
        *,
        profile:profiles(
          username,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();

    if (collectionError) {
      console.error("Error fetching collection:", collectionError);
      return null;
    }

    // Fetch the items in this collection
    const { data: collectionItems, error: itemsError } = await supabase
      .from("collection_items")
      .select(`
        *,
        media:media_id (
          id,
          title,
          type,
          year,
          rating,
          genres,
          description,
          cover_image,
          duration,
          director,
          author,
          publisher,
          platform,
          external_id,
          created_at
        )
      `)
      .eq("collection_id", id)
      .order("position");

    if (itemsError) {
      console.error("Error fetching collection items:", itemsError);
      return null;
    }

    const mediaItems: Media[] = collectionItems.map((item) => ({
      id: item.media.id,
      title: item.media.title,
      type: item.media.type as MediaType,
      coverImage: item.media.cover_image,
      year: item.media.year,
      rating: item.media.rating,
      genres: item.media.genres,
      description: item.media.description,
      duration: item.media.duration,
      director: item.media.director,
      author: item.media.author,
      publisher: item.media.publisher,
      platform: item.media.platform
    }));

    // Cast and sanitize the collection data to ensure it matches our expected type
    const collectionData: CollectionData = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      cover_image: collection.cover_image,
      type: collection.type,
      visibility: collection.visibility,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
      owner_id: collection.owner_id,
      // Handle the case where profile might be a SelectQueryError
      profile: collection.profile && typeof collection.profile === 'object' && !Array.isArray(collection.profile) 
        ? { 
            username: collection.profile.username, 
            avatar_url: collection.profile.avatar_url 
          } 
        : null
    };
    
    // Use the mapCollectionFromDB utility to convert the DB format to our app format
    const mappedCollection = mapCollectionFromDB(collectionData);
    
    // Add the media items to the collection
    return {
      ...mappedCollection,
      items: mediaItems
    };
  } catch (error) {
    console.error("Error in getCollectionById:", error);
    return null;
  }
}
