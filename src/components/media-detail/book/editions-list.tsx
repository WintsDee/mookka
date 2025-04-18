
import React from "react";
import { BookEdition } from "@/types/book";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

interface EditionsListProps {
  editions: BookEdition[];
}

export function EditionsList({ editions }: EditionsListProps) {
  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Format</TableHead>
            <TableHead>Éditeur</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead>ISBN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {editions.map((edition) => (
            <TableRow key={edition.isbn}>
              <TableCell className="font-medium">{edition.format}</TableCell>
              <TableCell>{edition.publisher}</TableCell>
              <TableCell>{formatDate(new Date(edition.publishDate))}</TableCell>
              <TableCell>{edition.pageCount}</TableCell>
              <TableCell className="font-mono text-xs">{edition.isbn}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
