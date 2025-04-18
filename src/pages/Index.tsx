
import React from "react";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-auto">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <MainContent />
    </div>
  );
};

export default Index;
