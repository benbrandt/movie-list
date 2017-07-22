// @flow
import type {
  MovieResult,
  RankingResult,
  SearchInfo,
  Sources,
  TmdbMovie
} from "./types";
const _ = require("lodash");
const { Lokka } = require("lokka");
const { Transport } = require("lokka-transport-http");
// const bfi = require("./scrapers/bfi");
const imdb = require("./scrapers/imdb");
const letterboxd = require("./scrapers/letterboxd");
const metacritic = require("./scrapers/metacritic");
const mubi = require("./scrapers/mubi");
const rottenTomatoes = require("./scrapers/rottenTomatoes");
const tmdb = require("./scrapers/tmdb");

// Set timezone to UTC (needed for Graphcool);
process.env.TZ = "UTC";
const headers = {
  Authorization: `Bearer ${process.env.GRAPHCOOL_TOKEN || ""}`
};

const client = new Lokka({
  transport: new Transport(
    `https://api.graph.cool/simple/v1/${process.env.GRAPHCOOL_ENDPOINT || ""}`,
    { headers }
  )
});

const escapeEllipse = string => string.replace(/\.\.\./g, "…");

const sourceParams = (positions): string => {
  return Object.keys(positions)
    .map(source => `${source}: ${positions[source] + 1}`)
    .join(", ");
};

const createMovie = async (
  movie: TmdbMovie,
  positions: { [id: string]: number }
) => {
  const result: MovieResult = await client.mutate(`{
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
        ${sourceParams(positions)}
      }
    ) {
      id
    }
  }`);
  if (!result) console.log(movie);
  return result.movie.id;
};

const updateMovie = async (
  id: string,
  rankingId: string,
  movie: TmdbMovie,
  positions: { [id: string]: number }
) => {
  const result: MovieResult = await client.mutate(`{
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

    ranking: updateRanking(
      id: "${rankingId}",
      ${sourceParams(positions)}
    ) {
      id
    }
  }`);
  if (!result) console.log(movie);
  return result.movie.id;
};

const updateOrCreateMovie = async (
  movie: TmdbMovie,
  positions: { [id: string]: number }
) => {
  const result: {
    Movie: { id: string } & RankingResult
  } = await client.query(`{
    Movie(tmdbId: ${movie.id}) {
      id
      ranking {
        id
      }
    }
  }`);

  console.log(`Saving ${movie.title}`);
  return result.Movie
    ? updateMovie(result.Movie.id, result.Movie.ranking.id, movie, positions)
    : createMovie(movie, positions);
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

const getTmdbMovies = async (
  scrapeMoviesFunc: () => Promise<SearchInfo[]>
): Promise<Array<?TmdbMovie>> => {
  const items = await scrapeMoviesFunc();
  const movies = await searchMovies(items);
  return movies;
};

const scrapeMovieFuncs: Array<{
  scrape: Function,
  source: Sources
}> = [
  { scrape: imdb.getTopMovies, source: "imdb" },
  {
    scrape: letterboxd.getTopMovies,
    source: "letterboxd"
  },
  {
    scrape: metacritic.getTopMovies,
    source: "metacritic"
  },
  { scrape: mubi.getTopMovies, source: "mubi" },
  {
    scrape: rottenTomatoes.getTopMovies,
    source: "rottenTomatoes"
  }
];

const scrapeMovies = async () => {
  const movieList = {};
  const rankingList = {};

  for (let scraper of scrapeMovieFuncs) {
    const movies = await getTmdbMovies(scraper.scrape);
    movies.forEach((movie, index) => {
      if (movie) {
        movieList[movie.id] = movie;
        if (!rankingList[movie.id]) rankingList[movie.id] = {};
        rankingList[movie.id][scraper.source] = index;
      }
    });
  }

  const topTmdb = await tmdb.getTopMovies();
  topTmdb.forEach((movie, index) => {
    if (movie) {
      movieList[movie.id] = movie;
      if (!rankingList[movie.id]) rankingList[movie.id] = {};
      rankingList[movie.id].tmdb = index;
    }
  });

  const tmdbIds = Object.keys(movieList);
  const movieIds = [];

  for (let id of tmdbIds) {
    movieIds.push(await updateOrCreateMovie(movieList[id], rankingList[id]));
  }

  console.log(`Updated ${movieIds.length} movies`);
};

module.exports = { scrapeMovies };
