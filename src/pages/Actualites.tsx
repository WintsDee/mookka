
import React, { useState, useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PageTitle } from "@/components/page-title";
import { fetchNews, NewsItem } from "@/services/news-service";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Actualites = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async (type?: string) => {
    try {
      setLoading(true);
      const newsData = await fetchNews(type === "all" ? undefined : type);
      setNews(newsData);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNews(activeTab === "all" ? undefined : activeTab);
      toast.success("Actualités mises à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      loadNews();
    } else {
      loadNews(value);
    }
  };

  const renderNewsContent = (items: NewsItem[]) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-40 py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Chargement des actualités...</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-center px-6">
          <p className="text-muted-foreground">
            Aucune actualité trouvée pour cette catégorie
          </p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Rafraîchir
          </Button>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 px-1">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-secondary/40 border-border/50">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <div className="relative h-44">
                  <img 
                    src={item.image || '/placeholder.svg'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="text-xs text-white/80">
                      {item.source} • {formatDistanceToNow(new Date(item.date), { 
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-1">{item.title}</h3>
                  </div>
                </div>
              </a>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };
  
  return (
    <Background>
      <div className="pb-24 pt-6">
        <header className="px-6 mb-6">
          <PageTitle title="Actualités" />
          <div className="flex justify-between items-center mt-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
                <TabsTrigger value="film" className="text-xs">Films</TabsTrigger>
                <TabsTrigger value="serie" className="text-xs">Séries</TabsTrigger>
                <TabsTrigger value="book" className="text-xs">Livres</TabsTrigger>
                <TabsTrigger value="game" className="text-xs">Jeux</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {renderNewsContent(news)}
              </TabsContent>
              
              <TabsContent value="film" className="mt-4">
                {renderNewsContent(news.filter(item => item.category === 'film'))}
              </TabsContent>
              
              <TabsContent value="serie" className="mt-4">
                {renderNewsContent(news.filter(item => item.category === 'serie'))}
              </TabsContent>
              
              <TabsContent value="book" className="mt-4">
                {renderNewsContent(news.filter(item => item.category === 'book'))}
              </TabsContent>
              
              <TabsContent value="game" className="mt-4">
                {renderNewsContent(news.filter(item => item.category === 'game'))}
              </TabsContent>
            </Tabs>
          </div>
        </header>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Actualites;
