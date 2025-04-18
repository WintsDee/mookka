
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useNews } from "@/hooks/use-news";
import { useTrending } from "@/hooks/use-trending";
import { NewsGrid } from "@/components/news/news-grid";
import { TrendingGrid } from "@/components/trending/trending-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { NewsWebView } from "@/components/news/news-web-view";

const Decouvrir = () => {
  const [activeTab, setActiveTab] = useLocalStorage("decouvrir-tab", "actualites");
  const { 
    news, 
    loading: newsLoading, 
    refreshing,
    handleRefresh,
    handleArticleSelect,
    selectedArticle,
    handleArticleClose
  } = useNews();

  const { trending, loading: trendingLoading } = useTrending();
  
  return (
    <Background className="animate-fade-in">
      <MobileHeader title="Découvrir" />
      <div className="pb-24 pt-16"> {/* Remplacé pt-safe mt-16 par pt-16 pour éliminer l'espace */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 h-11 mb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <TabsTrigger value="actualites">Actualités</TabsTrigger>
              <TabsTrigger value="tendances">Tendances</TabsTrigger>
            </TabsList>
            
            <TabsContent value="actualites" className="mt-2">
              <NewsGrid 
                items={news}
                loading={newsLoading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onArticleSelect={handleArticleSelect}
              />
            </TabsContent>
            
            <TabsContent value="tendances" className="mt-2">
              <TrendingGrid 
                items={trending}
                loading={trendingLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedArticle && (
        <NewsWebView
          url={selectedArticle.link}
          title={selectedArticle.title}
          onClose={handleArticleClose}
        />
      )}
      
      <MobileNav />
    </Background>
  );
};

export default Decouvrir;
