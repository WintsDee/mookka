import React from "react";
import { Profile } from "@/hooks/use-profile";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

// Nouvelles images de couverture et avatar liées au thème bibliothèque
const DEFAULT_COVER = "https://images.unsplash.com/photo-1481627834876-b7589e32df1b?q=80&w=2071&auto=format&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop";

interface ProfileHeaderProps {
  profile: Profile | null;
  isAuthenticated: boolean;
  onUpdateProfile: (values: Partial<Profile>) => Promise<void>;
}

export function ProfileHeader({ profile, isAuthenticated, onUpdateProfile }: ProfileHeaderProps) {
  return (
    <>
      <div 
        className="h-40 relative bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${profile?.cover_image || DEFAULT_COVER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <div className="w-20 h-20 rounded-full bg-background p-1">
            <img 
              src={profile?.avatar_url || DEFAULT_AVATAR} 
              alt={profile?.username || "Utilisateur"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{profile?.username || "Utilisateur"}</h1>
            <p className="text-sm text-muted-foreground">{profile?.bio || "Aucune biographie"}</p>
          </div>
          
          {isAuthenticated && profile && (
            <ProfileEditDialog profile={profile} onUpdate={onUpdateProfile} />
          )}
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">{profile?.following_count || 0}</span> abonnements
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">{profile?.followers_count || 0}</span> abonnés
          </div>
        </div>
        
        <Separator className="my-4" />
      </div>
    </>
  );
}
