
import React from "react";

interface HelpItemProps {
  title: string;
  content: string;
}

export function HelpItem({ title, content }: HelpItemProps) {
  return (
    <div className="rounded-lg border p-3">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{content}</p>
    </div>
  );
}
