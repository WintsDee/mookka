
import { useState, useCallback } from "react";
import { NewsItem } from "@/services/news-service";

export function useArticle() {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const handleArticleSelect = useCallback((article: NewsItem) => {
    setSelectedArticle(article);
  }, []);

  const handleArticleClose = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  return {
    selectedArticle,
    handleArticleSelect,
    handleArticleClose,
  };
}
