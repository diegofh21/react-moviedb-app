import axios from "axios"

// THEMOVIEDB CONFIG
const options = {
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNzk1NDQ4NThlYzIyZjYyNTY0NGZkNjQ5YzExMTZlYSIsIm5iZiI6MTcyMjgyNTU3NC40ODEwMDMsInN1YiI6IjY1MmFjYzdmMDI0ZWM4MDEwMTUxOTM3MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RqHtX5QTozUn0cl0CkIEBov81QVBnihr5cyy85Kzs14'
  }
};

export async function getMovies(page: number) {
  try {
    const resMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`, options)
    return resMovies.data;
  } catch(error) {
    console.error(error)
  }
}

export async function getMoviesByGenre(genreId: number, page: number) {
  try {
    const resMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`, options)
    return resMovies.data;
  } catch(error) {
    console.error(error)
  }
}

export async function getTvShows(page: number) {
  try {
    const resTvShows = await axios.get(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_origin_country=US&with_original_language=en`, options)
    return resTvShows.data;
  } catch(error) {
    console.error(error)
  }
}

export async function getTvShowsByGenre(genreId: number, page: number) {
  try {
    const resTvShows = await axios.get(`https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`, options)
    return resTvShows.data;
  } catch(error) {
    console.error(error)
  }
}

export async function getMovieGenres() {
  try {
    const resTvShows = await axios.get('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    return resTvShows.data;
  } catch(error) {
    console.error(error)
  }
}

export async function getTvGenres() {
  try {
    const resTvShows = await axios.get('https://api.themoviedb.org/3/genre/tv/list?language=en', options)
    return resTvShows.data;
  } catch(error) {
    console.error(error)
  }
}