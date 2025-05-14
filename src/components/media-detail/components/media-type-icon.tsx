
import React from "react";
import { MediaType } from "@/types";
import { BookOpen, Film, Gamepad, Tv2 as Tv } from "lucide-react";

interface MediaTypeIconProps {
  type: MediaType;
  className?: string;
}

export function MediaTypeIcon({ type, className = "h-5 w-5" }: MediaTypeIconProps) {
  switch (type) {
    case "book":
      return <BookOpen className={className} />;
    case "film":
      return <Film className={className} />;
    case "serie":
      return <Tv className={className} />;
    case "game":
      return <Gamepad className={className} />;
    default:
      return null;
  }
}
