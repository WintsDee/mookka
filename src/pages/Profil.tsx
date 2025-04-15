
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { currentUser, mockMedia } from "@/data/mockData";
import { MediaCard } from "@/components/media-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Profil = () => {
  // Stats utilisateur
  const stats = {
    films: mockMedia.filter(m => m.type === "film").length,
    series: mockMedia.filter(m => m.type === "serie").length,
    books: mockMedia.filter(m => m.type === "book").length,
    games: mockMedia.filter(m => m.type === "game").length,
    total: mockMedia.length
  };

  return (
    <Background>
      <MobileHeader title="Profil" />
      <div className="pt-safe pb-24 mt-16">
        {/* Header avec couverture */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
            <div className="w-20 h-20 rounded-full bg-background p-1">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-sm text-muted-foreground">{currentUser.bio}</p>
            </div>
            
            <Button variant="outline" size="icon">
              <Settings size={18} />
            </Button>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">{currentUser.following}</span> abonnements
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{currentUser.followers}</span> abonnés
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-sm text-center">
            <div>
              <p className="font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="font-bold">{stats.films}</p>
              <p className="text-xs text-muted-foreground">Films</p>
            </div>
            <div>
              <p className="font-bold">{stats.series}</p>
              <p className="text-xs text-muted-foreground">Séries</p>
            </div>
            <div>
              <p className="font-bold">{stats.books}</p>
              <p className="text-xs text-muted-foreground">Livres</p>
            </div>
            <div>
              <p className="font-bold">{stats.games}</p>
              <p className="text-xs text-muted-foreground">Jeux</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Tabs defaultValue="collections" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="reviews">Critiques</TabsTrigger>
                <TabsTrigger value="favorites">Favoris</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collections" className="mt-4">
                <h3 className="text-lg font-medium mb-4">Récemment ajoutés</h3>
                <ScrollArea className="h-[calc(100vh-380px)]">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {mockMedia.slice(0, 6).map((media) => (
                      <MediaCard key={media.id} media={media} size="small" />
                    ))}
                  </div>
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
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <p className="text-muted-foreground">
                    Vos favoris apparaîtront ici.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Profil;
