
import React from "react";

interface PageTitleProps {
  title?: string;
  children?: React.ReactNode;
}

export const PageTitle = ({ title, children }: PageTitleProps) => {
  const displayTitle = children || title;
  
  return (
    <h1 className="text-2xl font-bold">{displayTitle}</h1>
  );
};
