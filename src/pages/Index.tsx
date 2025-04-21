
import React, { useState } from "react";
import MainContent from "@/components/home/MainContent";
import LoadingScreen from "@/components/home/LoadingScreen";
import { Background } from "@/components/ui/background";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
      <Background>
        <div
          className={`relative min-h-screen w-full overflow-auto transition-opacity duration-1000 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <MainContent />
        </div>
      </Background>
    </>
  );
};

export default Index;

