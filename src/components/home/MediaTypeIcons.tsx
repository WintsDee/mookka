
import React from "react";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const MediaTypeIcons: React.FC = () => {
  return (
    <div className="flex justify-between w-full px-4 mt-10">
      <div className="flex flex-col items-center text-blue-500">
        <Film size={28} />
        <span className="text-sm mt-2">Films</span>
      </div>
      <div className="flex flex-col items-center text-purple-500">
        <Tv size={28} />
        <span className="text-sm mt-2">Séries</span>
      </div>
      <div className="flex flex-col items-center text-emerald-500">
        <Book size={28} />
        <span className="text-sm mt-2">Livres</span>
      </div>
      <div className="flex flex-col items-center text-amber-500">
        <GamepadIcon size={28} />
        <span className="text-sm mt-2">Jeux</span>
      </div>
    </div>
  );
};

export default MediaTypeIcons;
