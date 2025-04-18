
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useNews } from "@/hooks/news";
import { NewsTabs } from "@/components/news/news-tabs";
import { NewsWebView } from "@/components/news/news-web-view";
import { NewsSourceSelector } from "@/components/news/news-source-selector";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

const Actualites = () => {
  const { 
    news, 
    loading, 
    refreshing, 
    activeTab, 
    activeSource,
    activeSources,
    sources,
    selectedArticle,
    handleTabChange, 
    handleSourceChange,
    handleSourcesChange,
    handleRefresh,
    handleArticleSelect,
    handleArticleClose
  } = useNews();
  
  return (
    <Background>
      <MobileHeader title="Actualités" />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <div className="flex justify-between items-center mt-4 mb-2">
            <NewsTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {news.length} articles disponibles
            </p>
            <div className="flex items-center gap-2">
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
              <NewsSourceSelector 
                sources={sources}
                activeSource={activeSource}
                activeSources={activeSources}
                onSourceChange={handleSourceChange}
                onSourcesChange={handleSourcesChange}
              />
            </div>
          </div>
        </header>
        
        <div className="px-4">
          <NewsTabs.Content 
            news={news}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onArticleSelect={handleArticleSelect}
          />
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

export default Actualites;
