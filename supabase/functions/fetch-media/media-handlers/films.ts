
export const fetchTrendingFilms = async (apiKey: string) => {
  const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  // Fetch genres to map IDs to names
  const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=fr-FR`)
  const genresData = await genresResponse.json()
  const genreMap = Object.fromEntries(genresData.genres?.map((g: any) => [g.id, g.name]) || [])
  
  return data.results?.slice(0, 8).map((item: any) => ({
    id: item.id,
    title: item.title,
    type: 'film',
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    year: item.release_date ? parseInt(item.release_date.substring(0, 4)) : null,
    rating: item.vote_average,
    genres: item.genre_ids?.map((id: number) => genreMap[id] || `Genre ${id}`),
    popularity: item.popularity
  })) || []
}

export const fetchFilmById = async (apiKey: string, id: string) => {
  const appendParams = 'credits,external_ids,videos,watch/providers,release_dates'
  const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
  const response = await fetch(apiUrl)
  return await response.json()
}
