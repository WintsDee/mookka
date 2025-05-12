
import React, { useState } from "react";
import { Check, X, Clock, Eye, Ban } from "lucide-react";
import { MediaStatus, MediaType } from "@/types";
import { updateMediaStatus } from "@/services/media";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StatusDropdownProps {
  mediaId: string;
  mediaType: MediaType;
  currentStatus: MediaStatus | null;
  isInLibrary: boolean;
  onStatusUpdate?: (newStatus: MediaStatus) => void;
  variant?: "button" | "badge";
  size?: "sm" | "md" | "lg";
}

export function StatusDropdown({
  mediaId,
  mediaType,
  currentStatus,
  isInLibrary,
  onStatusUpdate,
  variant = "button",
  size = "md",
}: StatusDropdownProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get status label and icon based on status code
  const getStatusInfo = (status: MediaStatus | null) => {
    switch (status) {
      // À faire statuses
      case "to-watch":
        return { label: "À voir", icon: Eye, color: "text-yellow-500", bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20" };
      case "to-read":
        return { label: "À lire", icon: Eye, color: "text-yellow-500", bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20" };
      case "to-play":
        return { label: "À jouer", icon: Eye, color: "text-yellow-500", bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20" };
      
      // En cours statuses
      case "watching":
      case "reading":
      case "playing":
        return { label: "En cours", icon: Clock, color: "text-purple-500", bgColor: "bg-purple-500/10 hover:bg-purple-500/20" };
      
      // Completed status
      case "completed":
        return { label: "Terminé", icon: Check, color: "text-green-500", bgColor: "bg-green-500/10 hover:bg-green-500/20" };
      
      // Abandoned status - using neutral gray color
      case "abandoned":
        return { label: "Abandonné", icon: Ban, color: "text-gray-500", bgColor: "bg-gray-500/10 hover:bg-gray-500/20" };
      
      default:
        return { label: "Changer le statut", icon: Eye, color: "text-primary", bgColor: "bg-primary/10 hover:bg-primary/20" };
    }
  };

  // Get available status options based on media type
  const getStatusOptions = () => {
    const baseOptions: { value: MediaStatus; label: string; icon: any }[] = [];
    
    switch (mediaType) {
      case "film":
      case "serie":
        baseOptions.push(
          { value: "to-watch", label: "À voir", icon: Eye },
          { value: "watching", label: "En cours", icon: Clock },
          { value: "completed", label: "Terminé", icon: Check }
        );
        break;
      case "book":
        baseOptions.push(
          { value: "to-read", label: "À lire", icon: Eye },
          { value: "reading", label: "En cours", icon: Clock },
          { value: "completed", label: "Terminé", icon: Check }
        );
        break;
      case "game":
        baseOptions.push(
          { value: "to-play", label: "À jouer", icon: Eye },
          { value: "playing", label: "En cours", icon: Clock },
          { value: "completed", label: "Terminé", icon: Check }
        );
        break;
    }
    
    // Add abandoned option only if the media is already in the user's library
    if (isInLibrary) {
      baseOptions.push({ value: "abandoned", label: "Abandonné", icon: Ban });
    }
    
    return baseOptions;
  };

  const handleStatusChange = async (newStatus: MediaStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      await updateMediaStatus(mediaId, newStatus);
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut a été changé pour "${getStatusInfo(newStatus).label}"`,
      });
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const statusOptions = getStatusOptions();
  
  // Render as badge variant
  if (variant === "badge") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge 
            className={`cursor-pointer ${statusInfo.bgColor} ${statusInfo.color} px-2 py-1 gap-1 animate-fade-in`}
          >
            {React.createElement(statusInfo.icon, { className: "h-3 w-3" })}
            {statusInfo.label}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isUpdating}
              className={currentStatus === option.value ? "bg-accent" : ""}
            >
              {React.createElement(option.icon, { className: "h-4 w-4 mr-2" })}
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Render as button variant (default)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className={`${statusInfo.bgColor} ${statusInfo.color} border-current/30 gap-1 animate-fade-in`}
          disabled={isUpdating}
        >
          {React.createElement(statusInfo.icon, { className: size === "sm" ? "h-3 w-3" : "h-4 w-4" })}
          {statusInfo.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={isUpdating || currentStatus === option.value}
            className={currentStatus === option.value ? "bg-accent" : ""}
          >
            {React.createElement(option.icon, { className: "h-4 w-4 mr-2" })}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
