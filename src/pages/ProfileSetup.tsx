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
import { ProfileImagePicker } from "@/components/profile/image-picker/profile-image-picker";

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, isAuthenticated, updateProfile } = useProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (profile?.username) {
      navigate('/bibliotheque');
    }
  }, [isAuthenticated, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Background>
      <MobileHeader />
      <div className="container max-w-2xl mx-auto px-4 py-8">
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, username: e.target.value }))
                  }
                  required
                  minLength={3}
                  maxLength={30}
                />
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enregistrement..." : "Commencer à utiliser l'application"}
            </Button>
          </form>
        </div>
      </div>
    </Background>
  );
};

export default ProfileSetup;
