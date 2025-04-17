
import React from "react";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const MediaTypeIcons: React.FC = () => {
  return (
    <div className="flex justify-center space-x-8 w-full px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-blue-500/20 rounded-full p-3 mb-2 group-hover:bg-blue-500/30 transition-all duration-300 shadow-sm">
          <Film size={32} className="text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-white/80 group-hover:text-blue-400 transition-colors font-medium">Films</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-purple-500/20 rounded-full p-3 mb-2 group-hover:bg-purple-500/30 transition-all duration-300 shadow-sm">
          <Tv size={32} className="text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-white/80 group-hover:text-purple-400 transition-colors font-medium">Séries</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-emerald-500/20 rounded-full p-3 mb-2 group-hover:bg-emerald-500/30 transition-all duration-300 shadow-sm">
          <Book size={32} className="text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-white/80 group-hover:text-emerald-400 transition-colors font-medium">Livres</span>
      </div>
      
      <div className="flex flex-col items-center group transition-all duration-300 ease-in-out">
        <div className="bg-amber-500/20 rounded-full p-3 mb-2 group-hover:bg-amber-500/30 transition-all duration-300 shadow-sm">
          <GamepadIcon size={32} className="text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xs text-white/80 group-hover:text-amber-400 transition-colors font-medium">Jeux</span>
      </div>
    </div>
  );
};

export default MediaTypeIcons;
