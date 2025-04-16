
import { MediaType } from "@/types";
import { BookOpen, Film, Gamepad, Tv, Library } from "lucide-react";

interface UserStatsProps {
  stats: {
    films: number;
    series: number;
    books: number;
    games: number;
    total: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="flex justify-between text-sm text-center">
      <div>
        <div className="flex justify-center mb-1">
          <Library size={18} className="text-primary" />
        </div>
        <p className="font-bold">{stats.total}</p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
      <div>
        <div className="flex justify-center mb-1">
          <Film size={18} className="text-media-film" />
        </div>
        <p className="font-bold">{stats.films}</p>
        <p className="text-xs text-muted-foreground">Films</p>
      </div>
      <div>
        <div className="flex justify-center mb-1">
          <Tv size={18} className="text-media-serie" />
        </div>
        <p className="font-bold">{stats.series}</p>
        <p className="text-xs text-muted-foreground">Séries</p>
      </div>
      <div>
        <div className="flex justify-center mb-1">
          <BookOpen size={18} className="text-media-book" />
        </div>
        <p className="font-bold">{stats.books}</p>
        <p className="text-xs text-muted-foreground">Livres</p>
      </div>
      <div>
        <div className="flex justify-center mb-1">
          <Gamepad size={18} className="text-media-game" />
        </div>
        <p className="font-bold">{stats.games}</p>
        <p className="text-xs text-muted-foreground">Jeux</p>
      </div>
    </div>
  );
}
