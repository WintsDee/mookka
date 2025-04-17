
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
        "min-h-screen w-full",
        noScroll ? "" : "overflow-auto scrollbar-hide overscroll-none -webkit-overflow-scrolling-touch will-change-scroll",
        pattern ? "bg-pattern" : "bg-background",
        className
      )}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 60px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 70px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export { Background };
