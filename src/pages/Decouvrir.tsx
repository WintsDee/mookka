
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useNews } from "@/hooks/use-news";
import { useTrending } from "@/hooks/use-trending";
import { useNewReleases } from "@/hooks/use-new-releases";
import { NewsGrid } from "@/components/news/news-grid";
import { TrendingGrid } from "@/components/trending/trending-grid";
import { NewReleasesGrid } from "@/components/new-releases/new-releases-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { NewsWebView } from "@/components/news/news-web-view";

const Decouvrir = () => {
  const [activeTab, setActiveTab] = useLocalStorage("decouvrir-tab", "nouveautes");
  const { 
    news, 
    loading: newsLoading, 
    refreshing: newsRefreshing,
    handleRefresh: handleNewsRefresh
  } = useNews();

  const { 
    trending, 
    loading: trendingLoading,
    handleRefresh: handleTrendingRefresh,
    refreshing: trendingRefreshing
  } = useTrending();

  const { 
    releases, 
    loading: releasesLoading,
    handleRefresh: handleNewReleasesRefresh,
    refreshing: releasesRefreshing
  } = useNewReleases();

  const handleRefresh = () => {
    switch (activeTab) {
      case "nouveautes":
        handleNewReleasesRefresh();
        break;
      case "tendances":
        handleTrendingRefresh();
        break;
      case "actualites":
        handleNewsRefresh();
        break;
    }
  };
  
  return (
    <Background>
      <MobileHeader title="Découvrir" />
      <div className="pb-24 pt-16">
        <div className="px-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 h-11 mb-4">
              <TabsTrigger value="nouveautes">Nouveautés</TabsTrigger>
              <TabsTrigger value="tendances">Tendances</TabsTrigger>
              <TabsTrigger value="actualites">Actualités</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nouveautes" className="mt-2">
              <NewReleasesGrid 
                items={releases}
                loading={releasesLoading}
                refreshing={releasesRefreshing}
                onRefresh={handleNewReleasesRefresh}
              />
            </TabsContent>
            
            <TabsContent value="tendances" className="mt-2">
              <TrendingGrid 
                items={trending}
                loading={trendingLoading}
                refreshing={trendingRefreshing}
                onRefresh={handleTrendingRefresh}
              />
            </TabsContent>

            <TabsContent value="actualites" className="mt-2">
              <NewsGrid 
                items={news}
                loading={newsLoading}
                refreshing={newsRefreshing}
                onRefresh={handleNewsRefresh}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <MobileNav />
    </Background>
  );
};

export default Decouvrir;
