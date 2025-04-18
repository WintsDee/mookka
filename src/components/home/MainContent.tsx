
import React from "react";
import MookkaHeader from "./MookkaHeader";
import ActionButtons from "./ActionButtons";
import MediaTypeIcons from "./MediaTypeIcons";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const MainContent: React.FC = () => {
  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div className="w-full max-w-md flex flex-col items-center rounded-xl p-6 animate-fade-in">
        <MookkaHeader />
        <div className="mt-6 animate-fade-in [animation-delay:200ms]">
          <ActionButtons />
        </div>
        <div className="mt-6 animate-fade-in [animation-delay:400ms]">
          <MediaTypeIcons />
        </div>
        
        <div className="mt-8 opacity-80 hover:opacity-100 transition-opacity animate-fade-in [animation-delay:600ms]">
          <Link to="/soutenir">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs gap-1.5 text-white/70 hover:text-white/90 hover:bg-white/10"
            >
              <HeartHandshake size={14} />
              Soutenir le projet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
