// @flow
import type {
  TmdbMovie,
  TmdbTVShow,
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
const tvUrl = (id: number) => `${baseUrl}tv/${id}${apiKey}`;
const topMoviesUrl = (page: number) =>
  `${baseUrl}movie/top_rated${apiKey}&page=${page}`;
const topTVUrl = (page: number) =>
  `${baseUrl}tv/top_rated${apiKey}&page=${page}`;
const searchMoviesUrl = (query: string, year: ?number) => {
  const yearParam =
    year != null ? `&year=${encodeURIComponent(year.toString())}` : "";
  return `${baseUrl}search/movie${apiKey}&query=${encodeURIComponent(
    query
  )}${yearParam}`;
};
const searchTVUrl = (query: string, year: ?number) => {
  const yearParam =
    year != null
      ? `&first_air_date_year=${encodeURIComponent(year.toString())}`
      : "";
  return `${baseUrl}search/tv${apiKey}&query=${encodeURIComponent(
    query
  )}${yearParam}`;
};

// TMDB API HELPERS
const searchMovie = async ({
  title,
  year
}: SearchInfo): Promise<SearchResults> =>
  title != null
    ? delayedRequest(searchMoviesUrl(title, year))
    : Promise.resolve({ results: [], total: 0 });

const searchTVShow = async ({
  title,
  year
}: SearchInfo): Promise<SearchResults> =>
  title != null
    ? delayedRequest(searchTVUrl(title, year))
    : Promise.resolve({ results: [], total: 0 });

const getMovie = async (movie: ?SearchResult): Promise<?TmdbMovie> =>
  movie ? delayedRequest(movieUrl(movie.id)) : Promise.resolve(null);

const getTVShow = async (tvShow: ?SearchResult): Promise<?TmdbTVShow> =>
  tvShow ? delayedRequest(tvUrl(tvShow.id)) : Promise.resolve(null);

async function searchMovies(info: SearchInfo): Promise<?TmdbMovie> {
  let resp = await searchMovie(info);
  if (info.year != null && resp.results.length === 0) {
    resp = await searchMovie({ title: info.title, year: null });
  }
  console.log(
    `${info.title != null ? info.title : "no title"}: ${
      resp.results.length
    } results`
  );
  return getMovie(resp.results[0]);
}

async function searchTVShows(info: SearchInfo): Promise<?TmdbTVShow> {
  let resp = await searchTVShow(info);
  if (info.year != null && resp.results.length === 0) {
    resp = await searchTVShow({ title: info.title, year: null });
  }
  console.log(
    `${info.title != null ? info.title : "no title"}: ${
      resp.results.length
    } results`
  );
  return getTVShow(resp.results[0]);
}

async function getTopList(urlFn: number => string): Promise<SearchResult[]> {
  const urls = R.range(1, 6).map(urlFn);
  const results = [];

  for (let url of urls) {
    const list = await delayedRequest(url);
    results.push(list);
  }
  // $FlowFixMe
  return R.take(100)(
    R.pipe(
      R.flatten,
      R.map(({ results }: SearchResults) => results),
      R.flatten
    )(results)
  );
}

async function getTopMovies(): Promise<(?TmdbMovie)[]> {
  const topMovies: SearchResult[] = await getTopList(topMoviesUrl);
  const movies = [];

  for (let movie of topMovies) {
    const list = await getMovie(movie);
    movies.push(list);
  }

  return movies;
}

async function getTopTVShows(): Promise<(?TmdbTVShow)[]> {
  const topTVShows: SearchResult[] = await getTopList(topTVUrl);
  const tvShows = [];

  for (let tvShow of topTVShows) {
    const list = await getTVShow(tvShow);
    tvShows.push(list);
  }

  return tvShows;
}

module.exports = { getTopMovies, getTopTVShows, searchMovies, searchTVShows };
