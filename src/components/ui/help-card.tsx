
import React from "react";
import { HelpItem } from "@/components/settings/data/help-section-data";

interface HelpCardProps {
  question: string;
  answer: string;
  className?: string;
}

export function HelpCard({ question, answer, className = "" }: HelpCardProps) {
  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <h3 className="font-medium">{question}</h3>
      <p className="text-sm text-muted-foreground mt-1">{answer}</p>
    </div>
  );
}

