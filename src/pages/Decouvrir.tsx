
import React, { useEffect } from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useDiscover } from "@/hooks/use-discover";
import { DiscoverTabs } from "@/components/discover/discover-tabs";
import { DiscoverSection } from "@/components/discover/discover-section";
import { FeaturedMedia } from "@/components/discover/featured-media";
import { Button } from "@/components/ui/button";
import { Compass, RefreshCw, Loader2, Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useNews } from "@/hooks/use-news";
import { NewsGrid } from "@/components/news/news-grid";
import { NewsWebView } from "@/components/news/news-web-view";

const Decouvrir = () => {
  const { 
    sections, 
    loading, 
    refreshing, 
    activeTab,
    handleRefresh,
    handleTabChange,
    isMobile
  } = useDiscover();

  // Include news functionality from the old Actualités tab
  const {
    news,
    loading: newsLoading,
    refreshing: newsRefreshing,
    selectedArticle,
    handleRefresh: handleNewsRefresh,
    handleArticleSelect,
    handleArticleClose
  } = useNews();
  
  // Featured media is the first item from the first section (usually trending)
  const featuredMedia = sections.length > 0 && sections[0].items.length > 0 
    ? sections[0].items[0] 
    : null;
  
  return (
    <Background>
      <MobileHeader title="Découvrir" />
      <div className="pb-24 pt-safe mt-16 overflow-y-auto max-h-screen">
        <header className="px-4 mb-4 sticky top-0 bg-background z-10 pb-2">
          <div className="flex justify-between items-center mt-4 mb-2">
            <div className="flex items-center">
              <Compass className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-lg font-medium">Découvrir</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8"
            >
              {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span className="sr-only">Rafraîchir</span>
            </Button>
          </div>
          
          <DiscoverTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </header>
        
        <main className="px-4">
          {loading ? (
            <>
              <Skeleton className="w-full h-64 rounded-lg mb-6" />
              <DiscoverSection 
                section={{ 
                  id: 'loading-1', 
                  title: 'Loading...', 
                  type: 'trending', 
                  items: [] 
                }} 
                loading={true} 
              />
              <DiscoverSection 
                section={{ 
                  id: 'loading-2', 
                  title: 'Loading...', 
                  type: 'upcoming', 
                  items: [] 
                }} 
                loading={true} 
              />
            </>
          ) : (
            <>
              {featuredMedia && (
                <div className="mb-6">
                  <FeaturedMedia media={featuredMedia} isMobile={isMobile} />
                </div>
              )}
              
              {sections.map((section) => (
                <DiscoverSection 
                  key={section.id} 
                  section={section}
                />
              ))}
              
              {sections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Compass className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Rien à découvrir pour le moment</h3>
                  <p className="text-muted-foreground mb-4">
                    Nous n'avons pas trouvé de contenu à vous suggérer dans cette catégorie.
                  </p>
                  <Button onClick={handleRefresh} disabled={refreshing}>
                    {refreshing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Rafraîchir
                  </Button>
                </div>
              )}
              
              {/* News Section from the former Actualités tab */}
              <div className="mt-8 mb-4">
                <Separator />
                <div className="flex justify-between items-center my-4">
                  <div className="flex items-center">
                    <Newspaper className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-medium">Actualités</h2>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNewsRefresh}
                    disabled={newsRefreshing}
                  >
                    {newsRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                
                <NewsGrid 
                  items={news.slice(0, 6)} // Show only first 6 news items
                  loading={newsLoading}
                  refreshing={newsRefreshing}
                  onRefresh={handleNewsRefresh}
                  onArticleSelect={handleArticleSelect}
                />
              </div>
            </>
          )}
        </main>
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
