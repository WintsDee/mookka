
import React from "react";
import MookkaHeader from "./MookkaHeader";
import ActionButtons from "./ActionButtons";
import MediaTypeIcons from "./MediaTypeIcons";

const MainContent: React.FC = () => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div className="w-full max-w-md animate-fade-in flex flex-col items-center rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6 shadow-2xl">
        <MookkaHeader />
        <div className="mt-6">
          <ActionButtons />
        </div>
        <div className="mt-6">
          <MediaTypeIcons />
        </div>
      </div>
    </div>
  );
};

export default MainContent;

