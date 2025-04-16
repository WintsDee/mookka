
import React from "react";
import { Profile } from "@/hooks/use-profile";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { Separator } from "@/components/ui/separator";
import { Users, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";

interface ProfileHeaderProps {
  profile: Profile | null;
  isAuthenticated: boolean;
  onUpdateProfile: (values: Partial<Profile>) => Promise<void>;
}

export function ProfileHeader({ profile, isAuthenticated, onUpdateProfile }: ProfileHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <div 
        className="h-40 relative bg-cover bg-center transition-all duration-300"
        style={{ 
          backgroundImage: `url(${profile?.cover_image || DEFAULT_COVER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Settings button in top right */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Link to="/settings">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-white"
            >
              <Settings size={isMobile ? 16 : 18} />
            </Button>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <div className="w-20 h-20 rounded-full bg-background p-1 shadow-md transition-all duration-300">
            <img 
              src={profile?.avatar_url || DEFAULT_AVATAR} 
              alt={profile?.username || "Utilisateur"}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 px-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{profile?.username || "Utilisateur"}</h1>
            <p className="text-sm text-muted-foreground">{profile?.bio || "Aucune biographie"}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/soutenir">
              <Button 
                variant="outline" 
                className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary flex gap-1.5 items-center"
                size={isMobile ? "sm" : "default"}
              >
                <Heart size={isMobile ? 14 : 16} className="text-primary" />
                <span className={isMobile ? "text-xs" : ""}>Soutenir le projet</span>
              </Button>
            </Link>
            
            {isAuthenticated && profile && (
              <ProfileEditDialog profile={profile} onUpdate={onUpdateProfile} />
            )}
          </div>
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
