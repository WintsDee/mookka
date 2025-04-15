
import React from "react";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const MediaTypeIcons: React.FC = () => {
  return (
    <div className="flex justify-center space-x-8 w-full px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-blue-500/10 rounded-full p-3 mb-2 group-hover:bg-blue-500/20 transition-all duration-300">
          <Film size={32} className="text-blue-500 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-blue-500 transition-colors">Films</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-purple-500/10 rounded-full p-3 mb-2 group-hover:bg-purple-500/20 transition-all duration-300">
          <Tv size={32} className="text-purple-500 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-purple-500 transition-colors">Séries</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-emerald-500/10 rounded-full p-3 mb-2 group-hover:bg-emerald-500/20 transition-all duration-300">
          <Book size={32} className="text-emerald-500 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-emerald-500 transition-colors">Livres</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-amber-500/10 rounded-full p-3 mb-2 group-hover:bg-amber-500/20 transition-all duration-300">
          <GamepadIcon size={32} className="text-amber-500 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-amber-500 transition-colors">Jeux</span>
      </div>
    </div>
  );
};

export default MediaTypeIcons;
