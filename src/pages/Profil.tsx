import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { mockMedia } from "@/data/mockData";
import { MediaCard } from "@/components/media-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCollections } from "@/hooks/use-collections";
import { CollectionGrid } from "@/components/collections/collection-grid";
import { useProfile, Profile } from "@/hooks/use-profile";
import { ProfileEditDialog } from "@/components/profile/profile-edit-dialog";
import { UserStats } from "@/components/profile/user-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop";

const ProfileSkeleton = () => (
  <>
    <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
      <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
    </div>
    
    <div className="mt-12 px-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-7 w-40 mb-1" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      
      <div className="flex items-center gap-6 mt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between text-sm text-center">
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <Skeleton className="h-5 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </>
);

const Profil = () => {
  const { profile, loading, isAuthenticated, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const { myCollections, loadingMyCollections } = useCollections();

  const stats = {
    films: mockMedia.filter(m => m.type === "film").length,
    series: mockMedia.filter(m => m.type === "serie").length,
    books: mockMedia.filter(m => m.type === "book").length,
    games: mockMedia.filter(m => m.type === "game").length,
    total: mockMedia.length
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Background>
      <MobileHeader title="Profil" />
      <div className="pt-safe pb-24 mt-16">
        {loading ? (
          <ProfileSkeleton />
        ) : (
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
                  <ProfileEditDialog profile={profile} onUpdate={updateProfile} />
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
              
              <UserStats stats={stats} />
              
              <div className="mt-6">
                <Tabs defaultValue="collections" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="reviews">Critiques</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="collections" className="mt-4">
                    <h3 className="text-lg font-medium mb-4">Mes collections</h3>
                    <ScrollArea className="h-[calc(100vh-380px)]">
                      <CollectionGrid
                        collections={myCollections}
                        loading={loadingMyCollections}
                        emptyMessage="Vous n'avez pas encore créé de collection."
                        columns={2}
                        cardSize="small"
                      />
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                      <p className="text-muted-foreground">
                        Vos critiques apparaîtront ici.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites">
                    <h3 className="text-lg font-medium mb-4">Récemment ajoutés</h3>
                    <ScrollArea className="h-[calc(100vh-380px)]">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {mockMedia.slice(0, 6).map((media) => (
                          <MediaCard key={media.id} media={media} size="small" />
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
              
              {isAuthenticated && (
                <div className="mt-8">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Se déconnecter
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Profil;
