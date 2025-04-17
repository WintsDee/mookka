
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

  return data.social_share_settings as SocialShareSettings;
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
  const currentSettings = (currentData?.social_share_settings || {}) as SocialShareSettings;
  const updatedSettings = { ...currentSettings, ...settings };

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
