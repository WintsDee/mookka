
import { MediaType } from "@/types";

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
        <p className="font-bold">{stats.total}</p>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
      <div>
        <p className="font-bold">{stats.films}</p>
        <p className="text-xs text-muted-foreground">Films</p>
      </div>
      <div>
        <p className="font-bold">{stats.series}</p>
        <p className="text-xs text-muted-foreground">Séries</p>
      </div>
      <div>
        <p className="font-bold">{stats.books}</p>
        <p className="text-xs text-muted-foreground">Livres</p>
      </div>
      <div>
        <p className="font-bold">{stats.games}</p>
        <p className="text-xs text-muted-foreground">Jeux</p>
      </div>
    </div>
  );
}
