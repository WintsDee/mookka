
import { supabase } from "@/integrations/supabase/client";
import { MediaType } from "@/types";

/**
 * Retrieve media details by ID from external APIs or database
 */
export async function getMediaById(mediaType: MediaType, id: string) {
  console.log(`Getting ${mediaType} with ID ${id}`);
  
  try {
    // D'abord vérifier si le média existe déjà dans la base de données
    const { data: existingMedia, error: dbError } = await supabase
      .from('media')
      .select('*')
      .or(`id.eq.${id},external_id.eq.${id}`)
      .eq('type', mediaType)
      .maybeSingle();
    
    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération du média depuis la base de données:', dbError);
    }
    
    if (existingMedia) {
      console.log('Média trouvé dans la base de données:', existingMedia);
      return existingMedia;
    }
    
    // Si le média n'existe pas dans la base de données, interroger les API externes
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-media`;
    const response = await fetch(`${apiUrl}?type=${mediaType}&id=${id}`);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('Aucune donnée trouvée');
    }
    
    // Mettre à jour la base de données avec les données récupérées
    // Cette étape peut être ajoutée pour stocker le média en base de données si nécessaire
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du média ${mediaType}/${id}:`, error);
    throw error;
  }
}
