// @flow
import type {
  TmdbMovie,
  SearchInfo,
  SearchResult,
  SearchResults
} from "../types";
const { delayedRequest } = require("./request");
const R = require("ramda");

// TMDB API URLS
const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = `?api_key=${process.env.TMDB_API_KEY || ""}`;
const movieUrl = (id: number) => `${baseUrl}movie/${id}${apiKey}`;
const topMoviesUrl = (page: number) =>
  `${baseUrl}movie/top_rated${apiKey}&page=${page}`;
const searchUrl = (query: string, year: ?number) => {
  const yearParam =
    year != null ? `&year=${encodeURIComponent(year.toString())}` : "";
  return `${baseUrl}search/movie${apiKey}&query=${encodeURIComponent(query)}${
    yearParam
  }`;
};

// TMDB API HELPERS

const searchMovie = async ({
  title,
  year
}: SearchInfo): Promise<SearchResults> =>
  title != null
    ? delayedRequest(searchUrl(title, year))
    : Promise.resolve({ results: [], total: 0 });

const getMovie = async (movie: ?SearchResult): Promise<?TmdbMovie> =>
  movie ? delayedRequest(movieUrl(movie.id)) : Promise.resolve(null);

async function searchMovies(info: SearchInfo): $await<?TmdbMovie> {
  let resp = await searchMovie(info);
  if (resp.results.length === 0) {
    resp = await searchMovie({ title: info.title, year: null });
  }
  return getMovie(resp.results[0]);
}

async function getTopMoviesList(): $await<SearchResult[]> {
  const urls = R.range(1, 6).map(topMoviesUrl);
  const results = [];

  for (let url of urls) {
    results.push(await delayedRequest(url));
  }

  return R.pipe(
    R.flatten,
    R.map(({ results }: SearchResults) => results),
    R.flatten
  )(results);
}

async function getTopMovies(): $await<?(TmdbMovie[])> {
  const listArr: SearchResult[] = await getTopMoviesList();

  const topMovies: SearchResult[] = R.pipe(R.take(100))(listArr);
  const movies = [];

  for (let movie of topMovies) {
    movies.push(await getMovie(movie));
  }

  return movies;
}

module.exports = { getTopMovies, searchMovies };
