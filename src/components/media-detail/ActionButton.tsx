
import React from "react";
import { Button } from "@/components/ui/button";

/**
 * A button for an action in the media detail action bar.
 * - "emphasized" applies styles to attract user attention.
 */
interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  emphasized?: boolean;
  children: React.ReactNode;
}

export function ActionButton({
  emphasized = false,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={emphasized ? "default" : "ghost"}
      size="sm"
      className={
        emphasized
          ? `flex items-center gap-1.5 font-bold px-5 py-2 text-base shadow-lg bg-primary text-primary-foreground hover:bg-primary/80 ring-2 ring-offset-2 ring-primary ${className ?? ""}`
          : `flex items-center gap-1.5 ${className ?? ""}`
      }
      {...props}
    />
  );
}
