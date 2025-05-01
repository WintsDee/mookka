
import React, { useState, useEffect } from "react";
import MainContent from "@/components/home/MainContent";
import LoadingScreen from "@/components/home/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasBackground, setHasBackground] = useState(false);

  // Précharger l'image de fond de façon optimisée
  useEffect(() => {
    if (!isLoading) {
      const img = new Image();
      img.onload = () => {
        setHasBackground(true);
      };
      img.src = "/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png";
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
      <div 
        className={`relative min-h-screen w-full overflow-auto transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 z-0">
          {hasBackground ? (
            <img 
              src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
              alt="Mookka Background" 
              className="w-full h-full object-cover fixed"
            />
          ) : (
            <div className="w-full h-full bg-black fixed" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <MainContent />
      </div>
    </>
  );
};

export default Index;
