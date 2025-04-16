
import { MediaType } from "@/types";

export interface ProgressionTabProps {
  mediaId: string;
  mediaType: MediaType;
  mediaDetails: any;
}

export interface ProgressionHookResult {
  isLoading: boolean;
  progression: any;
  handleProgressionUpdate: (progressionData: any) => Promise<void>;
  createDefaultProgression: (type: MediaType) => any;
}
