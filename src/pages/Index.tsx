
import React from "react";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-auto">
      {/* Fond dégradé plus élégant */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#273349] opacity-90" />
      
      {/* Contenu principal */}
      <MainContent />
    </div>
  );
};

export default Index;

