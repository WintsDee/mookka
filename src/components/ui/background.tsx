
import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pattern?: boolean;
  noScroll?: boolean;
}

const Background = ({
  children,
  pattern = true,
  noScroll = false,
  className,
  ...props
}: BackgroundProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 w-full h-full overflow-auto overscroll-none",
        noScroll ? "overflow-hidden" : "",
        pattern ? "bg-pattern" : "bg-background",
        "scrollbar-hide -webkit-overflow-scrolling-touch",
        className
      )}
      {...props}
      data-component="background"
    >
      {children}
    </div>
  );
};

export { Background };
