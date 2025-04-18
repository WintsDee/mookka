
export const fetchTrendingBooks = async (apiKey: string) => {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=8&key=${apiKey}`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return data.items?.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo?.title,
    type: 'book',
    coverImage: item.volumeInfo?.imageLinks?.thumbnail,
    year: item.volumeInfo?.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : null,
    author: item.volumeInfo?.authors?.[0],
    rating: item.volumeInfo?.averageRating ? item.volumeInfo.averageRating * 2 : null,
    genres: item.volumeInfo?.categories
  })) || []
}

export const fetchBookById = async (apiKey: string, id: string) => {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
  const response = await fetch(apiUrl)
  return await response.json()
}
