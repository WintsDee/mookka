
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DiscoverTabs } from "@/components/discover/discover-tabs";
import { TrendingSection } from "@/components/discover/trending-section";
import { MediaGrid } from "@/components/discover/media-grid";
import { NewsTabs } from "@/components/news/news-tabs";
import { RefreshCw, Loader2 } from "lucide-react";
import { useDiscover } from "@/hooks/use-discover";
import { useNews } from "@/hooks/news";

const Decouvrir = () => {
  const {
    activeTab,
    trendingMedia,
    newReleases,
    newReleasesLoading,
    recommendations,
    recommendationsLoading,
    news,
    newsLoading,
    handleTabChange,
    handleRefresh
  } = useDiscover();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  };

  return (
    <Background>
      <MobileHeader title="Découvrir" />
      
      <div className="pb-24 pt-safe mt-16">
        <header className="px-4 pb-2 sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-end mb-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="h-8"
            >
              {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span className="sr-only">Rafraîchir</span>
            </Button>
          </div>
          
          <DiscoverTabs
            activeTab={activeTab}
            onTabChange={(value) => handleTabChange(value as any)}
          />
        </header>
        
        <Tabs value={activeTab} className="mt-4">
          <TabsContent value="trending" className="m-0">
            <TrendingSection mediaItems={trendingMedia} />
          </TabsContent>
          
          <TabsContent value="nouveautes" className="m-0">
            <MediaGrid 
              title="Nouveautés" 
              medias={newReleases}
              loading={newReleasesLoading}
              description="Les sorties récentes dans tous les domaines"
            />
          </TabsContent>
          
          <TabsContent value="recommandations" className="m-0">
            <MediaGrid 
              title="Recommandé pour vous" 
              medias={recommendations}
              loading={recommendationsLoading}
              description="Sélectionné en fonction de vos goûts"
            />
          </TabsContent>
          
          <TabsContent value="actualites" className="m-0">
            <div className="px-4 pt-2 pb-4">
              <NewsTabs.Content 
                news={news}
                loading={newsLoading}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onArticleSelect={() => {}}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Decouvrir;
