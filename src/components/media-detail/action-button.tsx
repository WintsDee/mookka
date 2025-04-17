
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  isLoading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  disabled, 
  children, 
  variant, 
  isLoading,
  className,
  ...props 
}) => (
  <Button
    onClick={onClick}
    disabled={disabled || isLoading}
    variant={variant || "outline"}
    size="sm"
    className={cn("text-xs", className)}
    {...props}
  >
    {isLoading ? (
      <AlertCircle className="mr-1 h-3 w-3 animate-pulse" />
    ) : (
      children
    )}
  </Button>
);
