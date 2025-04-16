
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { getSocialShareSettings, updateSocialShareSettings, SocialShareSettings } from "@/services/media/social-service";

export function SocialShareSettingsCard() {
  const [settings, setSettings] = useState<SocialShareSettings>({
    shareRatings: true,
    shareReviews: true,
    shareCollections: true,
    shareProgress: true,
    shareLibraryAdditions: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const userSettings = await getSocialShareSettings();
      setSettings(userSettings);
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: keyof SocialShareSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSocialShareSettings(settings);
    setSaving(false);
  };

  if (loading) {
    return (
      <Card className="border border-border/40 shadow-sm">
        <CardContent className="p-4 flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 shadow-sm bg-secondary/10">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Paramètres de partage</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="share-ratings" className="text-sm flex-grow">
              <span className="font-medium">Partager mes notes</span>
              <p className="text-xs text-muted-foreground">Les notes que j'attribue aux médias</p>
            </label>
            <Switch 
              id="share-ratings" 
              checked={settings.shareRatings} 
              onCheckedChange={() => handleToggle('shareRatings')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="share-reviews" className="text-sm flex-grow">
              <span className="font-medium">Partager mes critiques</span>
              <p className="text-xs text-muted-foreground">Les avis textuels que j'écris sur les médias</p>
            </label>
            <Switch 
              id="share-reviews" 
              checked={settings.shareReviews} 
              onCheckedChange={() => handleToggle('shareReviews')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="share-progress" className="text-sm flex-grow">
              <span className="font-medium">Partager mes progressions</span>
              <p className="text-xs text-muted-foreground">Quand je commence ou termine un film, livre, etc.</p>
            </label>
            <Switch 
              id="share-progress" 
              checked={settings.shareProgress} 
              onCheckedChange={() => handleToggle('shareProgress')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="share-collections" className="text-sm flex-grow">
              <span className="font-medium">Partager mes collections</span>
              <p className="text-xs text-muted-foreground">Les mises à jour de mes collections</p>
            </label>
            <Switch 
              id="share-collections" 
              checked={settings.shareCollections} 
              onCheckedChange={() => handleToggle('shareCollections')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="share-additions" className="text-sm flex-grow">
              <span className="font-medium">Partager les ajouts à ma bibliothèque</span>
              <p className="text-xs text-muted-foreground">Quand j'ajoute un nouveau média à ma bibliothèque</p>
            </label>
            <Switch 
              id="share-additions" 
              checked={settings.shareLibraryAdditions} 
              onCheckedChange={() => handleToggle('shareLibraryAdditions')}
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
