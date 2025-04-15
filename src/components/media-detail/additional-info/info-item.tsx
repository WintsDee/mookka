
import React from "react";
import { Separator } from "@/components/ui/separator";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  showSeparator?: boolean;
}

export function InfoItem({ icon, label, value, showSeparator = true }: InfoItemProps) {
  return (
    <React.Fragment>
      <div className="flex items-start gap-2">
        {icon}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
      {showSeparator && <Separator className="my-1" />}
    </React.Fragment>
  );
}
