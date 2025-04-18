
import React, { useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DiscoverTabs } from "@/components/discover/discover-tabs";
import { TrendingSection } from "@/components/discover/trending-section";
import { MediaGrid } from "@/components/discover/media-grid";
import { NewsTabs } from "@/components/news/news-tabs";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useDiscover } from "@/hooks/discover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";

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
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Réinitialiser les erreurs lorsque l'onglet change
    setError(null);
  }, [activeTab]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await handleRefresh();
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
      setError("Impossible de charger le contenu. Veuillez réessayer plus tard.");
      toast.error("Erreur de chargement");
    } finally {
      setRefreshing(false);
    }
  };

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-lg font-medium mb-2">Erreur de chargement</p>
      <p className="text-muted-foreground text-center px-4 mb-6">{error}</p>
      <Button onClick={onRefresh} variant="outline">
        Réessayer
      </Button>
    </div>
  );

  return (
    <Background>
      <MobileHeader title="Découvrir" />
      
      <div className="h-[calc(100vh-64px)] mt-16 flex flex-col">
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
        
        <ScrollArea className="flex-1 overflow-y-auto pb-16">
          {error ? (
            renderErrorState()
          ) : (
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
          )}
        </ScrollArea>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Decouvrir;
