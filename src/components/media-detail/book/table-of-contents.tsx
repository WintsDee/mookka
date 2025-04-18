
import React from "react";
import { BookChapter } from "@/types/book";
import { ChevronRight, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  chapters: BookChapter[];
  currentPage?: number;
  onChapterSelect?: (chapter: BookChapter) => void;
}

export function TableOfContents({
  chapters,
  currentPage,
  onChapterSelect
}: TableOfContentsProps) {
  const renderChapter = (chapter: BookChapter, depth: number = 0) => {
    const isCurrentChapter = currentPage !== undefined && 
      currentPage >= chapter.pageStart && 
      currentPage <= chapter.pageEnd;

    return (
      <AccordionItem value={chapter.id} key={chapter.id}>
        <AccordionTrigger className="hover:no-underline">
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isCurrentChapter && "text-primary font-medium",
            depth > 0 && "ml-4"
          )}>
            <BookOpen className="h-4 w-4" />
            <span>{chapter.title}</span>
            {isCurrentChapter && (
              <span className="text-xs text-muted-foreground ml-2">
                (En cours)
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {chapter.description && (
            <p className="text-sm text-muted-foreground mb-2 ml-6">
              {chapter.description}
            </p>
          )}
          {chapter.subChapters?.map(subChapter => 
            renderChapter(subChapter, depth + 1)
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-6 mt-2"
            onClick={() => onChapterSelect?.(chapter)}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Aller à la page {chapter.pageStart}
          </Button>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <Accordion type="single" collapsible className="w-full">
        {chapters.map(chapter => renderChapter(chapter))}
      </Accordion>
    </ScrollArea>
  );
}
