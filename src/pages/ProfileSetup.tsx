
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { ProfileImagePicker } from "@/components/profile/profile-image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import MookkaHeader from "@/components/home/MookkaHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
            alt="Mookka Background" 
            className="w-full h-full object-cover fixed"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center rounded-xl p-6 animate-fade-in">
        <MookkaHeader />
        
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

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-white">
                  Nom d'utilisateur
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  required
                  minLength={3}
                  maxLength={30}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 ${
                    usernameExists ? "border-destructive" : ""
                  }`}
                />
                {checkingUsername && (
                  <p className="text-xs text-white/70 mt-1">Vérification en cours...</p>
                )}
                {usernameExists && !checkingUsername && (
                  <p className="text-xs text-destructive mt-1">Ce nom d'utilisateur est déjà pris</p>
                )}
                {!usernameExists && formData.username.length >= 3 && !checkingUsername && (
                  <p className="text-xs text-green-500 mt-1">Ce nom d'utilisateur est disponible</p>
                )}
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-2 text-white">
                  Nom complet
                </label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2 text-white">
                  Biographie
                </label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Parlez-nous un peu de vous..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={4}
                />
              </div>
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
      </div>
    </div>
  );
};

export default ProfileSetup;
