
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface SocialShareSettings {
  shareRatings: boolean;
  shareReviews: boolean;
  shareCollections: boolean;
  shareProgress: boolean;
  shareLibraryAdditions: boolean;
}

// Convertir le type Json de Supabase en SocialShareSettings
const jsonToSocialShareSettings = (data: Json | null): SocialShareSettings => {
  const defaultSettings: SocialShareSettings = {
    shareRatings: true,
    shareReviews: true,
    shareCollections: true,
    shareProgress: true,
    shareLibraryAdditions: true
  };

  if (!data) return defaultSettings;

  // Si c'est un objet qui a les propriétés attendues
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const settings = data as Record<string, Json>;
    return {
      shareRatings: typeof settings.shareRatings === 'boolean' ? settings.shareRatings : defaultSettings.shareRatings,
      shareReviews: typeof settings.shareReviews === 'boolean' ? settings.shareReviews : defaultSettings.shareReviews,
      shareCollections: typeof settings.shareCollections === 'boolean' ? settings.shareCollections : defaultSettings.shareCollections,
      shareProgress: typeof settings.shareProgress === 'boolean' ? settings.shareProgress : defaultSettings.shareProgress,
      shareLibraryAdditions: typeof settings.shareLibraryAdditions === 'boolean' ? settings.shareLibraryAdditions : defaultSettings.shareLibraryAdditions
    };
  }

  return defaultSettings;
};

/**
 * Récupérer les paramètres de partage social d'un utilisateur
 */
export const getSocialShareSettings = async (): Promise<SocialShareSettings> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Utilisateur non connecté');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('social_share_settings')
      .eq('id', user.user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres de partage social:', error);
      throw error;
    }
    
    if (!data || !data.social_share_settings) {
      return {
        shareRatings: true,
        shareReviews: true,
        shareCollections: true,
        shareProgress: true,
        shareLibraryAdditions: true
      };
    }
    
    return jsonToSocialShareSettings(data.social_share_settings);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de partage social:', error);
    return {
      shareRatings: true,
      shareReviews: true,
      shareCollections: true,
      shareProgress: true,
      shareLibraryAdditions: true
    };
  }
};

/**
 * Mettre à jour les paramètres de partage social d'un utilisateur
 */
export const updateSocialShareSettings = async (settings: SocialShareSettings): Promise<void> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Créer un objet qui peut être stocké dans Supabase en tant que Json
    const dbSettings: Record<string, boolean> = {
      shareRatings: settings.shareRatings,
      shareReviews: settings.shareReviews,
      shareCollections: settings.shareCollections,
      shareProgress: settings.shareProgress,
      shareLibraryAdditions: settings.shareLibraryAdditions
    };
    
    // Mettre à jour directement dans la table profiles
    const { error } = await supabase
      .from('profiles')
      .update({ 
        social_share_settings: dbSettings as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id);
    
    if (error) {
      console.error('Erreur lors de la mise à jour des paramètres de partage social:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres de partage social:', error);
    throw error;
  }
};
