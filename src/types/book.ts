
export interface BookChapter {
  id: string;
  title: string;
  description?: string;
  pageStart: number;
  pageEnd: number;
  subChapters?: BookChapter[];
}

export interface BookEdition {
  isbn: string;
  publisher: string;
  publishDate: string;
  format: string;
  language: string;
  pageCount: number;
}

export interface ProfessionalReview {
  source: string;
  author?: string;
  rating?: number;
  content: string;
  date: string;
  url?: string;
}

export interface BookDetails {
  tableOfContents?: BookChapter[];
  editions?: BookEdition[];
  professionalReviews?: ProfessionalReview[];
}
