
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

interface ProfileSetupFormProps {
  onSubmit: (formData: {
    username: string;
    full_name: string;
    bio: string;
    avatar_url: string;
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
    avatar_url: "",
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
    <Card className="w-full mt-6 bg-black/20 backdrop-blur-sm border-white/20">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-white">Configurer votre profil</CardTitle>
          <CardDescription className="text-white/70">
            Personnalisez votre profil pour commencer à utiliser l'application
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Photo de profil
            </label>
            <ProfileImagePicker
              value={formData.avatar_url}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, avatar_url: url }))
              }
              type="avatar"
            />
          </div>

          <UsernameField
            username={formData.username}
            onChange={handleUsernameChange}
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
        </CardContent>
        
        <CardFooter>
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
