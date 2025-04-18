
export const fetchTrendingGames = async (apiKey: string) => {
  const currentYear = new Date().getFullYear()
  const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${currentYear-1}-01-01,${currentYear}-12-31&ordering=-added&page_size=8`
  
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return data.results?.map((item: any) => ({
    id: item.id,
    title: item.name,
    type: 'game',
    coverImage: item.background_image,
    year: item.released ? parseInt(item.released.substring(0, 4)) : null,
    rating: item.rating,
    genres: item.genres?.map((g: any) => g.name)
  })) || []
}

export const fetchGameById = async (apiKey: string, id: string) => {
  const apiUrl = `https://api.rawg.io/api/games/${id}?key=${apiKey}&language=fr`
  const response = await fetch(apiUrl)
  return await response.json()
}
