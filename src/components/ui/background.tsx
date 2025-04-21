
import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pattern?: boolean;
  noScroll?: boolean;
}

const Background = ({
  children,
  pattern = false, // par défaut on ne met plus le motif
  noScroll = false,
  className,
  ...props
}: BackgroundProps) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        noScroll ? "" : "overflow-auto scrollbar-hide overscroll-none -webkit-overflow-scrolling-touch will-change-scroll",
        pattern ? "bg-pattern" : "bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Background };

