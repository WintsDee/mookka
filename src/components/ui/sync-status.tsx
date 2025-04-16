
import React from "react";
import { Wifi, WifiOff, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SyncStatusProps extends Omit<BadgeProps, "children"> {
  status: 'synced' | 'local' | 'offline';
}

export function SyncStatus({ status, className, ...props }: SyncStatusProps) {
  const statusConfig = {
    synced: {
      icon: <Wifi size={12} />,
      text: "Synchronisé",
      tooltip: "Toutes les données sont synchronisées",
      variant: "success" as const
    },
    local: {
      icon: <RotateCw size={12} />,
      text: "Données locales",
      tooltip: "Des données sont stockées localement en attente de synchronisation",
      variant: "warning" as const
    },
    offline: {
      icon: <WifiOff size={12} />,
      text: "Hors ligne",
      tooltip: "Vous êtes hors ligne, certaines fonctionnalités sont limitées",
      variant: "destructive" as const
    }
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant} 
            className={`flex items-center gap-1 px-2 py-1 ${className}`}
            {...props}
          >
            <motion.span
              animate={status === 'local' ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              {config.icon}
            </motion.span>
            <span className="text-xs">{config.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
