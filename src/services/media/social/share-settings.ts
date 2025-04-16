
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { SocialShareSettings, DEFAULT_SHARE_SETTINGS } from "./types";

// Récupérer les paramètres de partage social
export async function getSocialShareSettings(): Promise<SocialShareSettings> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return DEFAULT_SHARE_SETTINGS;

    const { data, error } = await supabase
      .from('profiles')
      .select('social_share_settings')
      .eq('id', user.user.id)
      .single();

    if (error || !data) {
      return DEFAULT_SHARE_SETTINGS;
    }

    // Ensure data.social_share_settings is an object and cast it properly
    const settingsData = data.social_share_settings;
    
    // Check if it's actually an object with our expected structure
    if (!settingsData || typeof settingsData !== 'object' || Array.isArray(settingsData)) {
      return DEFAULT_SHARE_SETTINGS;
    }
    
    // Safely access properties with proper type checking
    return {
      shareRatings: typeof settingsData.shareRatings === 'boolean' ? settingsData.shareRatings : DEFAULT_SHARE_SETTINGS.shareRatings,
      shareReviews: typeof settingsData.shareReviews === 'boolean' ? settingsData.shareReviews : DEFAULT_SHARE_SETTINGS.shareReviews,
      shareCollections: typeof settingsData.shareCollections === 'boolean' ? settingsData.shareCollections : DEFAULT_SHARE_SETTINGS.shareCollections,
      shareProgress: typeof settingsData.shareProgress === 'boolean' ? settingsData.shareProgress : DEFAULT_SHARE_SETTINGS.shareProgress,
      shareLibraryAdditions: typeof settingsData.shareLibraryAdditions === 'boolean' ? settingsData.shareLibraryAdditions : DEFAULT_SHARE_SETTINGS.shareLibraryAdditions
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres de partage:", error);
    return DEFAULT_SHARE_SETTINGS;
  }
}

// Mettre à jour les paramètres de partage social
export async function updateSocialShareSettings(settings: Partial<SocialShareSettings>) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("Utilisateur non connecté");
    }

    // Récupérer les paramètres actuels
    const currentSettings = await getSocialShareSettings();
    
    // Fusionner avec les nouveaux paramètres
    const updatedSettings = {
      ...currentSettings,
      ...settings
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        social_share_settings: updatedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.user.id);

    if (error) throw error;

    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences de partage social ont été mises à jour",
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour vos préférences de partage",
      variant: "destructive",
    });
    return { success: false, error };
  }
}
