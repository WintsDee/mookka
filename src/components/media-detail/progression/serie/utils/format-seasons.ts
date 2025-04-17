
import { Season } from "../types/serie-progression";
import { createDefaultSeasons } from "./season-formatters/default-seasons";
import { formatBrooklyn99Seasons } from "./season-formatters/brooklyn99-seasons";
import { formatRegularSeasons } from "./season-formatters/regular-seasons";

export function formatSeasons(mediaDetails: any): Season[] {
  if (!mediaDetails) {
    return createDefaultSeasons();
  }

  if (mediaDetails.id === "48891" || mediaDetails.id === 48891) {
    return formatBrooklyn99Seasons(mediaDetails);
  }

  if (Array.isArray(mediaDetails.seasons)) {
    return formatRegularSeasons(mediaDetails);
  }

  return createDefaultSeasons();
}
