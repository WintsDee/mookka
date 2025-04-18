
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title?: string;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  sticky?: boolean;
}

export function MobileHeader({
  title,
  rightElement,
  showBackButton = false,
  onBackClick,
  className,
  sticky = true,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 w-full h-16 bg-background/95 backdrop-blur-sm z-50 pt-safe-top",
        sticky ? "fixed top-0 left-0" : "",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        {title && <h1 className="text-xl font-bold">{title}</h1>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
