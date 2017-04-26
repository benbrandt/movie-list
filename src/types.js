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
  id: string,
  bfi: ?number,
  imdb: ?number,
  letterboxd: ?number,
  metacritic: ?number,
  mubi: ?number,
  rottenTomatoes: ?number,
  tmdb: ?number
};

export type MovieResult = { movie: { id: string } };
export type RankingResult = { ranking: { id: string } };

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

type RankingNoMovieT = {
  bfi: ?number,
  createdAt: string,
  id: number,
  imdb: ?number,
  letterboxd: ?number,
  metacritic: ?number,
  mubi: ?number,
  position: number,
  rottenTomatoes: ?number,
  tmdb: ?number,
  updatedAt: string
};

type MovieNoRankingT = {
  backdrop: ?string,
  createdAt: string,
  id: string,
  language: string,
  originalTitle: string,
  overview: string,
  poster: ?string,
  releaseDate: string,
  runtime: number,
  tagline: ?string,
  title: string,
  tmdbId: number,
  updatedAt: string
  // users: Array<>
};

export type RankingT = {
  bfi: ?number,
  createdAt: string,
  id: number,
  imdb: ?number,
  letterboxd: ?number,
  metacritic: ?number,
  movie: MovieNoRankingT,
  mubi: ?number,
  position: number,
  rottenTomatoes: ?number,
  tmdb: ?number,
  updatedAt: string
};

export type MovieT = {
  backdrop: ?string,
  createdAt: string,
  id: string,
  language: string,
  originalTitle: string,
  overview: string,
  poster: ?string,
  ranking: RankingNoMovieT,
  releaseDate: string,
  runtime: number,
  tagline: ?string,
  title: string,
  tmdbId: number,
  updatedAt: string
  // users: Array<>
};
