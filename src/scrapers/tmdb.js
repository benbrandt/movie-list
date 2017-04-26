// @flow
import type {
  TmdbMovie,
  SearchInfo,
  SearchResult,
  SearchResults
} from "../types";
const { delayedRequest } = require("../lib/request");
const flatten = require("ramda/src/flatten");
const map = require("ramda/src/map");
const pipe = require("ramda/src/pipe");
const range = require("ramda/src/range");
const take = require("ramda/src/take");

// TMDB API URLS
const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = `?api_key=${process.env.TMDB_API_KEY || ""}`;
const movieUrl = (id: number) => `${baseUrl}movie/${id}${apiKey}`;
const topMoviesUrl = (page: number) =>
  `${baseUrl}movie/top_rated${apiKey}&page=${page}`;
const searchUrl = (query: string, year: ?number) => {
  const yearParam = year ? `&year=${encodeURIComponent(year.toString())}` : "";
  return `${baseUrl}search/movie${apiKey}&query=${encodeURIComponent(query)}${yearParam}`;
};

// TMDB API HELPERS

function searchMovie({ title, year }: SearchInfo): Promise<SearchResults> {
  return title
    ? delayedRequest(searchUrl(title, year))
    : Promise.resolve({ results: [], total: 0 });
}

function getMovie(movie: ?SearchResult): Promise<?TmdbMovie> {
  return movie ? delayedRequest(movieUrl(movie.id)) : Promise.resolve(null);
}

async function searchMovies(info: SearchInfo): Promise<?TmdbMovie> {
  let resp = await searchMovie(info);
  if (resp.results.length === 0) {
    resp = await searchMovie({ title: info.title, year: null });
  }
  return getMovie(resp.results[0]);
}

async function getTopMoviesList(): Promise<SearchResults[][]> {
  const urls = range(1, 6).map(topMoviesUrl);
  const results = [];

  for (let url of urls) {
    results.push(await delayedRequest(url));
  }

  return results;
}

async function getTopMovies(): Promise<(?TmdbMovie)[]> {
  const listArr = await getTopMoviesList();

  const getResults = map(({ results }) => results);
  const first100 = take(100);

  const topMovies: SearchResult[] = pipe(
    flatten,
    getResults,
    flatten,
    first100
  )(listArr);
  const movies = [];

  for (let movie of topMovies) {
    movies.push(await getMovie(movie));
  }

  return movies;
}

module.exports = { getTopMovies, searchMovies };
