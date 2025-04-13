
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MediaCard } from "@/components/media-card";
import { mockMedia } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  
  // Filtrer les médias en fonction du type sélectionné
  const filteredMedia = filter === "all" 
    ? mockMedia 
    : mockMedia.filter(media => media.type === filter);
  
  // Grouper les médias par statut
  const mediaByStatus = {
    current: filteredMedia.filter(m => m.status === "watching"),
    pending: filteredMedia.filter(m => m.status === "to-watch"),
    completed: filteredMedia.filter(m => m.status === "completed")
  };

  return (
    <Background>
      <div className="pb-24 pt-6">
        <header className="px-6 mb-6">
          <h1 className="text-2xl font-bold">Ma Bibliothèque</h1>
          
          <div className="mt-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilter("all")}
                  className="text-xs"
                >
                  Tout
                </TabsTrigger>
                <TabsTrigger 
                  value="film" 
                  onClick={() => setFilter("film")}
                  className="text-xs"
                >
                  Films
                </TabsTrigger>
                <TabsTrigger 
                  value="serie" 
                  onClick={() => setFilter("serie")}
                  className="text-xs"
                >
                  Séries
                </TabsTrigger>
                <TabsTrigger 
                  value="book" 
                  onClick={() => setFilter("book")}
                  className="text-xs"
                >
                  Livres
                </TabsTrigger>
                <TabsTrigger 
                  value="game" 
                  onClick={() => setFilter("game")}
                  className="text-xs"
                >
                  Jeux
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="px-6 space-y-8">
            {/* En cours de visionnage/lecture/jeu */}
            {mediaByStatus.current.length > 0 && (
              <section>
                <h2 className="text-lg font-medium mb-4">En cours</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {mediaByStatus.current.map((media) => (
                    <MediaCard key={media.id} media={media} size="medium" />
                  ))}
                  <button className="flex flex-col items-center justify-center w-40 h-60 border border-dashed border-muted-foreground/50 rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <PlusCircle size={24} />
                    <span className="mt-2 text-sm">Ajouter</span>
                  </button>
                </div>
              </section>
            )}
            
            {/* À voir/lire/jouer */}
            {mediaByStatus.pending.length > 0 && (
              <section>
                <h2 className="text-lg font-medium mb-4">À découvrir</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {mediaByStatus.pending.map((media) => (
                    <MediaCard key={media.id} media={media} size="medium" />
                  ))}
                  <button className="flex flex-col items-center justify-center w-40 h-60 border border-dashed border-muted-foreground/50 rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <PlusCircle size={24} />
                    <span className="mt-2 text-sm">Ajouter</span>
                  </button>
                </div>
              </section>
            )}
            
            {/* Terminés */}
            {mediaByStatus.completed.length > 0 && (
              <section>
                <h2 className="text-lg font-medium mb-4">Terminés</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {mediaByStatus.completed.map((media) => (
                    <MediaCard key={media.id} media={media} size="medium" />
                  ))}
                  <button className="flex flex-col items-center justify-center w-40 h-60 border border-dashed border-muted-foreground/50 rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <PlusCircle size={24} />
                    <span className="mt-2 text-sm">Ajouter</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;
