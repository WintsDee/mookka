
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { mockNews } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PageTitle } from "@/components/page-title";

const Actualites = () => {
  return (
    <Background>
      <div className="pb-24 pt-6">
        <header className="px-6 mb-6">
          <PageTitle title="Actualités" />
          
          <div className="mt-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
                <TabsTrigger value="films" className="text-xs">Films</TabsTrigger>
                <TabsTrigger value="series" className="text-xs">Séries</TabsTrigger>
                <TabsTrigger value="books" className="text-xs">Livres</TabsTrigger>
                <TabsTrigger value="games" className="text-xs">Jeux</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4 px-1">
                    {mockNews.map((news) => (
                      <Card key={news.id} className="overflow-hidden bg-secondary/40 border-border/50">
                        <div className="relative h-44">
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4">
                            <span className="text-xs text-white/80">
                              {news.source} • {formatDistanceToNow(new Date(news.date), { 
                                addSuffix: true,
                                locale: fr
                              })}
                            </span>
                            <h3 className="text-white font-bold text-lg mt-1">{news.title}</h3>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {["films", "series", "books", "games"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                    <p className="text-muted-foreground">
                      Actualités {tab === "films" ? "des films" : 
                      tab === "series" ? "des séries" : 
                      tab === "books" ? "des livres" : "des jeux"} à venir dans la prochaine mise à jour
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Actualites;
