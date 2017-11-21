// @flow
export type Sources =
  | "bfi"
  | "imdb"
  | "letterboxd"
  | "metacritic"
  | "mubi"
  | "rottenTomatoes"
  | "tmdb";

export type Rankings = {
  bfi?: ?number,
  imdb?: ?number,
  letterboxd?: ?number,
  metacritic?: ?number,
  mubi?: ?number,
  rottenTomatoes?: ?number,
  tmdb?: ?number
};

export type SearchInfo = {
  title: ?string,
  year: ?number
};

export type SearchResult = { id: number };
export type SearchResults = { results: SearchResult[], total: number };

export type TmdbMovie = {
  id: number,
  title: string,
  original_title: string,
  overview: string,
  tagline: string,
  runtime: string,
  release_date: string,
  original_language: string,
  poster_path: ?string,
  backdrop_path: ?string
};

export type TmdbTVShow = {
  id: number,
  name: string,
  original_name: string,
  overview: string,
  number_of_episodes: number,
  number_of_seasons: number,
  original_language: string,
  poster_path: ?string,
  backdrop_path: ?string,
  first_air_date: string,
  last_air_date: string
};

export type MovieT = {
  backdrop: ?string,
  createdAt: string,
  id: string,
  language: string,
  originalTitle: string,
  overview: string,
  poster: ?string,
  score: number,
  rankings: Rankings,
  releaseDate: string,
  runtime: number,
  tagline: ?string,
  title: string,
  tmdbId: number
};
