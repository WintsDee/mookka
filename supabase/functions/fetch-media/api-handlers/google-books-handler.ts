
export async function handleGoogleBooks(query?: string, id?: string) {
  const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') ?? '';
  
  let bookQuery = query;
  if (!id && query) {
    bookQuery = `${query} OR inauthor:${query}`;
  }
  
  const url = id 
    ? `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
    : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookQuery!)}&key=${apiKey}&maxResults=40`;
    
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}
