
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BadgesSectionProps {
  title: string;
  items?: string[];
  icon: React.ReactNode;
  variant?: "outline" | "default" | "secondary" | "destructive" | "film" | "serie" | "book" | "game";
  maxItems?: number;
}

export function BadgesSection({ title, items, icon, variant = "outline", maxItems = 5 }: BadgesSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <>
      <Separator className="my-1" />
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.slice(0, maxItems).map((item, index) => (
            <Badge key={index} variant={variant} className={variant === "outline" ? "bg-secondary/60" : ""}>
              {item}
            </Badge>
          ))}
          {items.length > maxItems && (
            <Badge variant={variant} className={variant === "outline" ? "bg-secondary/60" : ""}>
              +{items.length - maxItems}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
}
