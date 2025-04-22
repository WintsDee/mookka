
import { MediaType, MediaStatus } from "@/types";

export interface AddMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
}

export type StatusOption = {
  value: MediaStatus;
  label: string;
  description: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export type MediaStatusCount = {
  status: MediaStatus;
  count: number;
}

export type MediaTypeStatsGroup = {
  type: MediaType | 'all';
  label: string;
  icon: React.ElementType;
  totalCount: number;
  statusGroups: {
    inProgress: MediaStatusCount[];
    todo: MediaStatusCount[];
    completed: MediaStatusCount[];
  };
}
