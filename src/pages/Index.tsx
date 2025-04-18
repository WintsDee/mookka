
import React, { useEffect } from "react";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  // Prefetch any additional resources needed for the Index page
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling during initial render
    
    return () => {
      document.body.style.overflow = ""; // Restore scrolling when component unmounts
    };
  }, []);
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Background image with optimized attributes */}
        <img 
          src="/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png" 
          alt="Mookka Background" 
          className="w-full h-full object-cover fixed"
          loading="eager" 
          fetchpriority="high"
          decoding="sync"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Main content */}
      <MainContent />
    </div>
  );
};

export default Index;
