
import React from "react";

interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 flex-shrink-0">
        <img 
          src="/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png" 
          alt="Mookka Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};
