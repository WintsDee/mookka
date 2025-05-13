
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

/**
 * Search for media in the local Mookka database
 */
export async function searchLocalDatabase(type: MediaType, query: string): Promise<any[]> {
  try {
    // Search in the database using Mookka's media table
    // Use .or to search in title AND in author/director
    const { data: localMedia, error: localError } = await supabase
      .from('media')
      .select('*')
      .eq('type', type)
      .or(`title.ilike.%${query}%, author.ilike.%${query}%, director.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);
    
    if (localError) {
      console.error("Error searching local media:", localError);
      return [];
    }

    console.log(`Local database search results: ${localMedia?.length || 0} items found`);
    return localMedia || [];
  } catch (error) {
    console.error("Error in searchLocalDatabase:", error);
    return [];
  }
}
