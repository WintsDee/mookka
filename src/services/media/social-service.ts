
import { supabase } from "@/integrations/supabase/client";

interface SocialShareSettings {
  shareRatings: boolean;
  shareReviews: boolean;
  shareCollections: boolean;
  shareProgress: boolean;
  shareLibraryAdditions: boolean;
}

/**
 * Récupère les paramètres de partage social de l'utilisateur
 */
export async function getSocialShareSettings(): Promise<SocialShareSettings> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('social_share_settings')
      .eq('id', user.user.id)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération des paramètres de partage:", error);
      throw error;
    }
    
    const defaultSettings: SocialShareSettings = {
      shareRatings: true,
      shareReviews: true,
      shareCollections: true,
      shareProgress: true,
      shareLibraryAdditions: true
    };
    
    if (!data || !data.social_share_settings) {
      return defaultSettings;
    }
    
    return {
      ...defaultSettings,
      ...data.social_share_settings
    };
  } catch (error) {
    console.error("Erreur dans getSocialShareSettings:", error);
    throw error;
  }
}

/**
 * Met à jour les paramètres de partage social de l'utilisateur
 */
export async function updateSocialShareSettings(settings: Partial<SocialShareSettings>): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }
    
    // D'abord, récupérer les paramètres actuels
    const { data: currentData, error: selectError } = await supabase
      .from('profiles')
      .select('social_share_settings')
      .eq('id', user.user.id)
      .single();
      
    if (selectError) {
      console.error("Erreur lors de la récupération des paramètres actuels:", selectError);
      throw selectError;
    }
    
    const currentSettings = currentData.social_share_settings || {};
    
    // Mettre à jour les paramètres
    const updatedSettings = {
      ...currentSettings,
      ...settings
    };
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ social_share_settings: updatedSettings })
      .eq('id', user.user.id);
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour des paramètres:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Erreur dans updateSocialShareSettings:", error);
    throw error;
  }
}
