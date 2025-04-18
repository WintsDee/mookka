
export type PlatformType = "streaming" | "purchase" | "rent";
export type PlatformCategory = "subscription" | "vod" | "free";
export type PricingType = "subscription" | "pay-per-view" | "freemium";

export interface PlatformPricing {
  type: PricingType;
  plans: string[];
  startingPrice: string;
}

export interface Platform {
  id: string;
  name: string;
  url: string;
  type: PlatformType;
  category: PlatformCategory;
  logo?: string;
  isAvailable: boolean;
  pricing?: PlatformPricing;
}

export interface PlatformHookResult {
  platforms: Platform[];
  isLoading: boolean;
  error: string | null;
  availablePlatforms: Platform[];
  hasAvailablePlatforms: boolean;
}
