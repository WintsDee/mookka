
import { MediaType } from "@/types";

export interface Platform {
  id: string;
  name: string;
  url: string;
  type: "streaming" | "purchase" | "rent" | "free";
  category?: "subscription" | "vod" | "free";
  logo?: string;
  isAvailable?: boolean;
}

export interface PlatformHookResult {
  platforms: Platform[];
  isLoading: boolean;
  error: string | null;
  availablePlatforms: Platform[];
  hasAvailablePlatforms: boolean;
}
