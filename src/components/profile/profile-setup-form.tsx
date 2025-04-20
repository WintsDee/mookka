
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProfileImagePicker } from "@/components/profile/profile-image-picker";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsernameField } from "./setup/username-field";
import { FullNameField } from "./setup/full-name-field";
import { BioField } from "./setup/bio-field";
import { MediaPreferences } from "./setup/media-preferences";

// Images thématiques pour l'avatar
const THEMED_IMAGES = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", // Cinéma
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60", // Bibliothèque
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60", // Gaming
  "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=60", // TV/Séries
];

interface ProfileSetupFormProps {
  onSubmit: (formData: {
    username: string;
    full_name: string;
    bio: string;
    avatar_url: string;
    genres_preferences: string[];
  }) => Promise<void>;
}

export function ProfileSetupForm({ onSubmit }: ProfileSetupFormProps) {
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: THEMED_IMAGES[Math.floor(Math.random() * THEMED_IMAGES.length)],
    genres_preferences: [] as string[],
  });
  
  const { toast } = useToast();

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    
    setCheckingUsername(true);
    try {
      const { data, error } = await supabase.rpc('check_username_exists', {
        username_to_check: username
      });
      
      if (error) {
        console.error('Erreur lors de la vérification du nom d\'utilisateur:', error);
        return;
      }
      
      setUsernameExists(data);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, username: value }));
    checkUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usernameExists) {
      toast({
        title: "Nom d'utilisateur déjà pris",
        description: "Veuillez choisir un autre nom d'utilisateur.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.username || formData.username.length < 3) {
      toast({
        title: "Nom d'utilisateur requis",
        description: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mt-6 bg-black/20 backdrop-blur-sm border-white/20 overflow-y-auto max-h-[80vh]">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-white">Configurer votre profil</CardTitle>
          <CardDescription className="text-white/70">
            Personnalisez votre profil pour commencer à utiliser l'application
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Photo de profil
            </label>
            <div className="grid gap-4">
              <ProfileImagePicker
                value={formData.avatar_url}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, avatar_url: url }))
                }
                type="avatar"
              />
              <p className="text-sm text-white/70">
                Choisissez une image qui vous représente parmi notre sélection thématique
                ou importez la vôtre
              </p>
            </div>
          </div>

          <UsernameField
            username={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            checkingUsername={checkingUsername}
            usernameExists={usernameExists}
          />

          <FullNameField
            fullName={formData.full_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, full_name: e.target.value }))
            }
          />

          <BioField
            bio={formData.bio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, bio: e.target.value }))
            }
          />

          <MediaPreferences
            preferences={formData.genres_preferences}
            onChange={(preferences) =>
              setFormData((prev) => ({ ...prev, genres_preferences: preferences }))
            }
          />
        </CardContent>
        
        <CardFooter className="pb-6">
          <Button 
            type="submit" 
            className="w-full font-medium shadow-md hover:shadow-lg transition-all"
            disabled={loading || usernameExists}
          >
            {loading ? "Enregistrement..." : "Commencer à utiliser l'application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
