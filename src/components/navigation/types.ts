
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  path: string;
  icon: LucideIcon;
  label: string;
  special?: boolean;
}
