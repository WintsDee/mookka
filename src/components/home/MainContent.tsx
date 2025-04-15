
import React from "react";
import MookkaHeader from "./MookkaHeader";
import ActionButtons from "./ActionButtons";
import MediaTypeIcons from "./MediaTypeIcons";

const MainContent: React.FC = () => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md animate-fade-in flex flex-col items-center p-6 rounded-xl">
        <MookkaHeader />
        <ActionButtons />
        <MediaTypeIcons />
      </div>
    </div>
  );
};

export default MainContent;
