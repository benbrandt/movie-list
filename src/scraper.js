// @flow
import type {
  MovieResult,
  Rankings,
  RankingResult,
  SearchInfo,
  Sources,
  TmdbMovie
} from "./types";
const _ = require("lodash");
const { Lokka } = require("lokka");
const { Transport } = require("lokka-transport-http");
const bfi = require("./scrapers/bfi");
const imdb = require("./scrapers/imdb");
const letterboxd = require("./scrapers/letterboxd");
const metacritic = require("./scrapers/metacritic");
const mubi = require("./scrapers/mubi");
const rottenTomatoes = require("./scrapers/rottenTomatoes");
const tmdb = require("./scrapers/tmdb");
const { avgRank } = require("./rankings");

// Set timezone to UTC (needed for Graphcool);
process.env.TZ = "UTC";

const client = new Lokka({
  transport: new Transport(
    `https://api.graph.cool/simple/v1/${process.env.GRAPHCOOL_ENDPOINT || ""}`
  )
});

const createMovie = async (
  movie: TmdbMovie,
  index: number,
  source: Sources
) => {
  const result: MovieResult = await client.mutate(
    `{
    movie: createMovie(
      tmdbId: ${movie.id},
      title: "${_.escape(movie.title)}",
      backdrop: "${movie.backdrop_path || ""}",
      language: "${movie.original_language}",
      originalTitle: "${_.escape(movie.original_title)}",
      overview: "${escapeEllipse(_.escape(movie.overview))}",
      poster: "${movie.poster_path || ""}",
      releaseDate: "${movie.release_date}",
      runtime: ${movie.runtime},
      tagline: "${movie.tagline ? escapeEllipse(_.escape(movie.tagline)) : ""}",
      ranking: {
        ${source}: ${index + 1}
      }
    ) {
      id
    }
  }`
  );
  if (!result) console.log(movie);
  return result.movie.id;
};

const escapeEllipse = string => string.replace(/\.\.\./g, "…");

const updateMovie = async (
  id: string,
  rankingId: string,
  movie: TmdbMovie,
  index: number,
  source: Sources
) => {
  const result: MovieResult = await client.mutate(
    `{
    movie: updateMovie(
      id: "${id}",
      tmdbId: ${movie.id},
      title: "${_.escape(movie.title)}",
      backdrop: "${movie.backdrop_path || ""}",
      language: "${movie.original_language}",
      originalTitle: "${_.escape(movie.original_title)}",
      overview: "${escapeEllipse(_.escape(movie.overview))}",
      poster: "${movie.poster_path || ""}",
      releaseDate: "${movie.release_date}",
      runtime: ${movie.runtime},
      tagline: "${movie.tagline ? escapeEllipse(_.escape(movie.tagline)) : ""}"
    ) {
      id
    }
  }`
  );
  const rankingResult: RankingResult = await client.mutate(
    `{
    ranking: updateRanking(
      id: "${rankingId}",
      ${source}: ${index + 1}
    ) {
      id
    }
  }`
  );
  if (!result || !rankingResult) console.log(movie);
  return result.movie.id;
};

const updateOrCreateMovie = async (
  movie: TmdbMovie,
  index: number,
  source: Sources
) => {
  const result: {
    Movie: { id: string } & RankingResult
  } = await client.query(
    `{
    Movie(tmdbId: ${movie.id}) {
      id
      ranking {
        id
      }
    }
  }`
  );

  return result.Movie
    ? updateMovie(
        result.Movie.id,
        result.Movie.ranking.id,
        movie,
        index,
        source
      )
    : createMovie(movie, index, source);
};

const updateOrCreateMovies = async (
  movies: (?TmdbMovie)[],
  source: Sources
) => {
  const movieIds = [];
  let index = 0;

  for (let movie of movies) {
    if (movie) {
      console.log(`Saving: ${movie.title}`);
      movieIds.push(await updateOrCreateMovie(movie, index, source));
    }
    index++;
  }

  return movieIds;
};

const searchMovies = async (
  searchItems: SearchInfo[]
): Promise<Array<?TmdbMovie>> => {
  const movies = [];

  for (let item of searchItems) {
    console.log(`Searching: ${item.title || "no title"}`);
    movies.push(await tmdb.searchMovies(item));
  }

  return movies;
};

const getRankings = async (): Promise<Rankings[]> => {
  const result: {
    allRankings: Rankings[]
  } = await client.query(
    `{
    allRankings {
      id
      bfi
      imdb
      letterboxd
      metacritic
      mubi
      rottenTomatoes
      tmdb
    }
  }`
  );

  return result.allRankings;
};

const updateRank = async (id: string, position: number): Promise<string> => {
  const result: RankingResult = await client.mutate(
    `{
    ranking: updateRanking(
      id: "${id}",
      position: ${position}
    ) {
      id
    }
  }`
  );
  if (!result) console.log(result);
  return result.ranking.id;
};

const updateRankings = async (): Promise<string[]> => {
  const rankings = await getRankings();
  const rankingIds = [];

  for (let ranking of rankings) {
    const newRank = avgRank(ranking);
    console.log(newRank);
    rankingIds.push(await updateRank(ranking.id, newRank));
  }

  return rankingIds;
};

const main = async () => {
  // const movies = await tmdb.getTopMovies();
  // const movieIds = await updateOrCreateMovies(movies, "tmdb");
  // const items = await bfi.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "bfi");
  // const items = await imdb.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "imdb");
  // const items = await letterboxd.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "letterboxd");
  // const items = await metacritic.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "metacritic");
  // const items = await mubi.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "mubi");
  // const items = await rottenTomatoes.getTopMovies();
  // const movies = await searchMovies(items);
  // const movieIds = await updateOrCreateMovies(movies, "rottenTomatoes");
  // console.log(`Created ${movieIds.length} movies`);

  const rankingIds = await updateRankings();
  console.log(`Updated ${rankingIds.length} rankings`);
};

main().catch((e: Error) => console.error(e));
