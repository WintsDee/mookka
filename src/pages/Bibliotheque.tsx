
import React, { useState } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterIcon, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileHeader } from "@/components/mobile-header";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Bibliotheque = () => {
  const [filter, setFilter] = useState<MediaType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <Background>
      <MobileHeader title="Ma Bibliothèque" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="mt-4 relative">
            <Input
              type="text"
              placeholder="Rechercher dans ma bibliothèque..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            
            <Button variant="outline" size="icon" className="absolute right-0 top-0">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
          
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
        
        <ScrollArea className="h-[calc(100vh-220px)] px-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4 text-center">
              Votre bibliothèque est vide
            </p>
            <Link to="/recherche"> {/* Wrap the Button with Link */}
              <Button variant="outline">
                Commencez à ajouter du contenu
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Bibliotheque;

