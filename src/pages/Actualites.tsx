
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { PageTitle } from "@/components/page-title";
import { useNews } from "@/hooks/use-news";
import { NewsTabs } from "@/components/news/news-tabs";
import { NewsWebView } from "@/components/news/news-web-view";
import { NewsSourceSelector } from "@/components/news/news-source-selector";

const Actualites = () => {
  const { 
    news, 
    loading, 
    refreshing, 
    activeTab, 
    activeSource,
    sources,
    selectedArticle,
    handleTabChange, 
    handleSourceChange,
    handleRefresh,
    handleArticleSelect,
    handleArticleClose
  } = useNews();
  
  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-safe mt-16">
        <header className="px-6 mb-6">
          <PageTitle title="Actualités" />
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
            <NewsSourceSelector 
              sources={sources}
              activeSource={activeSource}
              onSourceChange={handleSourceChange}
            />
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
