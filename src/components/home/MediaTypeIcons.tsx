
import React from "react";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";

const MediaTypeIcons: React.FC = () => {
  return (
    <div className="flex justify-between w-full px-2 sm:px-4">
      <div className="flex flex-col items-center text-blue-500">
        <Film size={28} />
      </div>
      <div className="flex flex-col items-center text-purple-500">
        <Tv size={28} />
      </div>
      <div className="flex flex-col items-center text-emerald-500">
        <Book size={28} />
      </div>
      <div className="flex flex-col items-center text-amber-500">
        <GamepadIcon size={28} />
      </div>
    </div>
  );
};

export default MediaTypeIcons;
