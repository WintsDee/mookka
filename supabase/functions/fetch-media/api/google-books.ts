
import { corsHeaders } from "../cors.ts";
import { ApiConfig } from "../types.ts";

export async function fetchGoogleBooksData(id: string | null, query: string | null, apiKey: string): Promise<any> {
  let bookQuery = query;
  if (!id && query) {
    bookQuery = `${query} OR inauthor:${query}`;
  }
  
  const apiUrl = id 
    ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookQuery!)}&key=${apiKey}&maxResults=40`;

  const response = await fetch(apiUrl);
  return await response.json();
}

