
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  getSocialShareSettings,
  updateSocialShareSettings,
  type SocialShareSettings
} from "@/services/media/social-service";

export function PrivacySection() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['socialShareSettings'],
    queryFn: getSocialShareSettings
  });

  const handleToggle = async (setting: keyof SocialShareSettings) => {
    if (!settings) return;

    try {
      const newSettings = {
        ...settings,
        [setting]: !settings[setting]
      };
      
      await updateSocialShareSettings(newSettings);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Vos paramètres de confidentialité ont été mis à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="space-y-3">
          <div className="h-12 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const privacyOptions = [
    {
      key: 'shareRatings' as keyof SocialShareSettings,
      label: 'Partager mes notes',
      description: 'Permettre aux autres utilisateurs de voir mes notes'
    },
    {
      key: 'shareReviews' as keyof SocialShareSettings,
      label: 'Partager mes avis',
      description: 'Permettre aux autres utilisateurs de voir mes avis'
    },
    {
      key: 'shareCollections' as keyof SocialShareSettings,
      label: 'Partager mes collections',
      description: 'Permettre aux autres utilisateurs de voir mes collections'
    },
    {
      key: 'shareProgress' as keyof SocialShareSettings,
      label: 'Partager ma progression',
      description: 'Permettre aux autres utilisateurs de voir ma progression'
    },
    {
      key: 'shareLibraryAdditions' as keyof SocialShareSettings,
      label: 'Partager mes ajouts',
      description: 'Permettre aux autres utilisateurs de voir les médias que j\'ajoute'
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        Confidentialité
      </h2>

      <div className="space-y-6">
        {privacyOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">
                {option.description}
              </div>
            </div>
            <Switch
              checked={settings?.[option.key] ?? true}
              onCheckedChange={() => handleToggle(option.key)}
            />
          </div>
        ))}

        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-0 h-auto py-4 mt-6"
        >
          <div className="flex items-center gap-3">
            <Lock size={18} className="text-primary" />
            <div className="text-left">
              <div className="text-sm font-medium">Changer le mot de passe</div>
              <div className="text-sm text-muted-foreground">
                Modifier votre mot de passe actuel
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
