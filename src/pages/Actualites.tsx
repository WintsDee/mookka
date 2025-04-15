
import React from "react";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { PageTitle } from "@/components/page-title";
import { useNews } from "@/hooks/use-news";
import { NewsTabs } from "@/components/news/news-tabs";

const Actualites = () => {
  const { 
    news, 
    loading, 
    refreshing, 
    activeTab, 
    selectedSource,
    availableSources,
    handleTabChange, 
    handleSourceChange,
    handleRefresh 
  } = useNews();
  
  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-safe mt-12">
        <div className="px-6 mb-4">
          <PageTitle title="Actualités" />
          
          <div className="mt-4">
            <NewsTabs 
              news={news}
              loading={loading}
              refreshing={refreshing}
              activeTab={activeTab}
              selectedSource={selectedSource}
              availableSources={availableSources}
              onTabChange={handleTabChange}
              onSourceChange={handleSourceChange}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default Actualites;
