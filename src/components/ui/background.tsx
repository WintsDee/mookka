
import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pattern?: boolean;
}

const Background = ({
  children,
  pattern = true,
  className,
  ...props
}: BackgroundProps) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-auto scrollbar-hide",
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
