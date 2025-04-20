import React from "react";
import { Profile } from "@/hooks/use-profile";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { Separator } from "@/components/ui/separator";
import { Users, Heart, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileImagePicker } from "@/components/profile/image-picker/profile-image-picker";

interface ProfileHeaderProps {
  profile: Profile | null;
  isAuthenticated: boolean;
  onUpdateProfile: (values: Partial<Profile>) => Promise<void>;
}

export function ProfileHeader({ profile, isAuthenticated, onUpdateProfile }: ProfileHeaderProps) {
  const isMobile = useIsMobile();
  const [editingImage, setEditingImage] = React.useState<'avatar' | 'cover' | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  
  const updateSingleImage = async (type: 'avatar' | 'cover', value: string) => {
    if (!profile) return;
    
    if (type === 'avatar') {
      await onUpdateProfile({ avatar_url: value });
    } else {
      await onUpdateProfile({ cover_image: value });
    }
    
    setImageDialogOpen(false);
  };

  const handleImageClick = (type: 'avatar' | 'cover') => {
    if (isAuthenticated) {
      setEditingImage(type);
      setImageDialogOpen(true);
    }
  };

  return (
    <>
      <div 
        className="h-40 relative bg-cover bg-center transition-all duration-300 cursor-pointer"
        style={{ 
          backgroundImage: `url(${profile?.cover_image || DEFAULT_COVER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={() => isAuthenticated && handleImageClick('cover')}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {isAuthenticated && (
          <div className="absolute bottom-2 right-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick('cover');
              }}
            >
              <Image size={16} className="mr-1" />
              Modifier
            </Button>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <div 
            className="w-20 h-20 rounded-full bg-background p-1 shadow-md transition-all duration-300 relative cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              isAuthenticated && handleImageClick('avatar');
            }}
          >
            <img 
              src={profile?.avatar_url || DEFAULT_AVATAR} 
              alt={profile?.username || "Utilisateur"}
              className="w-full h-full rounded-full object-cover"
            />
            
            {isAuthenticated && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <Image size={18} className="text-white" />
              </div>
            )}
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
      
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingImage === 'avatar' 
                ? 'Modifier votre avatar' 
                : 'Modifier votre bannière'}
            </DialogTitle>
          </DialogHeader>
          
          {editingImage === 'avatar' && (
            <ProfileImagePicker 
              value={profile?.avatar_url || DEFAULT_AVATAR}
              onChange={(value) => updateSingleImage('avatar', value)}
              type="avatar"
            />
          )}
          
          {editingImage === 'cover' && (
            <ProfileImagePicker 
              value={profile?.cover_image || DEFAULT_COVER}
              onChange={(value) => updateSingleImage('cover', value)}
              type="cover"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
