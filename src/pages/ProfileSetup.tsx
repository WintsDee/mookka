
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Background } from "@/components/ui/background";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "@/components/mobile-header";
import { useProfile } from "@/hooks/use-profile";
import { ProfileImagePicker } from "@/components/profile/profile-image-picker";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isAuthenticated, loading: profileLoading, updateProfile } = useProfile();

  useEffect(() => {
    if (profileLoading) return;
    
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (profile?.username) {
      navigate('/bibliotheque');
    }
  }, [isAuthenticated, profile, navigate, profileLoading]);

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
      await updateProfile(formData);
      navigate("/bibliotheque");
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

  if (profileLoading) {
    return (
      <Background>
        <MobileHeader />
        <div className="container max-w-2xl mx-auto px-4 py-8 mt-16">
          <div className="space-y-6">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Background>
    );
  }

  return (
    <Background>
      <MobileHeader />
      <div className="container max-w-2xl mx-auto px-4 py-8 mt-16 animate-fade-in">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Configurer votre profil</h1>
            <p className="text-muted-foreground">
              Personnalisez votre profil pour commencer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
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

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  required
                  minLength={3}
                  maxLength={30}
                  className={usernameExists ? "border-destructive" : ""}
                />
                {checkingUsername && (
                  <p className="text-xs text-muted-foreground mt-1">Vérification en cours...</p>
                )}
                {usernameExists && !checkingUsername && (
                  <p className="text-xs text-destructive mt-1">Ce nom d'utilisateur est déjà pris</p>
                )}
                {!usernameExists && formData.username.length >= 3 && !checkingUsername && (
                  <p className="text-xs text-green-500 mt-1">Ce nom d'utilisateur est disponible</p>
                )}
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                  Nom complet
                </label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  Biographie
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Parlez-nous un peu de vous..."
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || usernameExists}>
              {loading ? "Enregistrement..." : "Commencer à utiliser l'application"}
            </Button>
          </form>
        </div>
      </div>
    </Background>
  );
};

export default ProfileSetup;
