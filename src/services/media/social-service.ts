
import { supabase } from "@/integrations/supabase/client";

export interface SocialShareSettings {
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
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    // Valeurs par défaut pour les utilisateurs non connectés
    return {
      shareRatings: true,
      shareReviews: true,
      shareCollections: true,
      shareProgress: true,
      shareLibraryAdditions: true
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('social_share_settings')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error("Erreur lors de la récupération des paramètres de partage:", error);
    throw error;
  }

  // Si aucun paramètre n'est défini, renvoyer les valeurs par défaut
  if (!data || !data.social_share_settings) {
    return {
      shareRatings: true,
      shareReviews: true,
      shareCollections: true,
      shareProgress: true,
      shareLibraryAdditions: true
    };
  }

  // Utiliser une conversion explicite avec une vérification de type pour éviter les erreurs
  const settings = data.social_share_settings as Record<string, boolean>;
  
  return {
    shareRatings: settings.shareRatings ?? true,
    shareReviews: settings.shareReviews ?? true,
    shareCollections: settings.shareCollections ?? true,
    shareProgress: settings.shareProgress ?? true,
    shareLibraryAdditions: settings.shareLibraryAdditions ?? true
  };
}

/**
 * Met à jour les paramètres de partage social de l'utilisateur
 */
export async function updateSocialShareSettings(settings: Partial<SocialShareSettings>): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  // Récupérer les paramètres actuels
  const { data: currentData, error: fetchError } = await supabase
    .from('profiles')
    .select('social_share_settings')
    .eq('id', user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Erreur lors de la récupération des paramètres de partage:", fetchError);
    throw fetchError;
  }

  // Fusionner les paramètres actuels avec les nouveaux
  // Utiliser une conversion explicite et des valeurs par défaut pour éviter les erreurs
  const currentSettings = currentData?.social_share_settings as Record<string, boolean> || {};
  
  const defaultSettings: SocialShareSettings = {
    shareRatings: true,
    shareReviews: true,
    shareCollections: true,
    shareProgress: true,
    shareLibraryAdditions: true
  };
  
  // Combiner les paramètres par défaut, les paramètres actuels et les nouveaux paramètres
  const updatedSettings = { 
    ...defaultSettings, 
    ...Object.fromEntries(
      Object.entries(currentSettings)
        .filter(([key]) => key in defaultSettings)
    ), 
    ...settings 
  };

  // Mettre à jour les paramètres
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      social_share_settings: updatedSettings,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error("Erreur lors de la mise à jour des paramètres de partage:", updateError);
    throw updateError;
  }
}
