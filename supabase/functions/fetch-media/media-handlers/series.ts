
export const fetchTrendingSeries = async (apiKey: string) => {
  const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr-FR&page=1`
  const response = await fetch(apiUrl)
  const data = await response.json()
  
  return data.results?.slice(0, 8).map((item: any) => ({
    id: item.id,
    title: item.name,
    type: 'serie',
    coverImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    year: item.first_air_date ? parseInt(item.first_air_date.substring(0, 4)) : null,
    rating: item.vote_average,
    genres: item.genre_ids,
    popularity: item.popularity
  })) || []
}

export const fetchSerieById = async (apiKey: string, id: string) => {
  const appendParams = 'credits,seasons,episode_groups,external_ids,content_ratings,videos,watch/providers'
  const apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=fr-FR&include_adult=false&append_to_response=${appendParams}`
  const response = await fetch(apiUrl)
  return await response.json()
}
