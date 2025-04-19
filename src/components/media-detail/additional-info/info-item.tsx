
import React from "react";
import { Separator } from "@/components/ui/separator";

interface InfoItemProps {
  icon?: React.ReactNode; // Make icon optional
  label: string;
  value: string | number;
  valueClassName?: string; // Add support for valueClassName
  showSeparator?: boolean;
}

export function InfoItem({ 
  icon, 
  label, 
  value, 
  valueClassName,
  showSeparator = true 
}: InfoItemProps) {
  return (
    <React.Fragment>
      <div className="flex items-start gap-2">
        {icon}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-sm font-medium ${valueClassName || ""}`}>{value}</p>
        </div>
      </div>
      {showSeparator && <Separator className="my-1" />}
    </React.Fragment>
  );
}
