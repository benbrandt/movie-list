// @flow
import type { Rankings, SearchInfo, Sources, TmdbMovie } from "./types";
const R = require("ramda");
const bfi = require("./scrapers/bfi");
const imdb = require("./scrapers/imdb");
const letterboxd = require("./scrapers/letterboxd");
const metacritic = require("./scrapers/metacritic");
const mubi = require("./scrapers/mubi");
const rottenTomatoes = require("./scrapers/rottenTomatoes");
const tmdb = require("./scrapers/tmdb");

function avgRank({
  bfi,
  imdb,
  letterboxd,
  metacritic,
  mubi,
  rottenTomatoes,
  tmdb
}: Rankings): number {
  let rankings = [];
  if (bfi != null) rankings.push(bfi);
  if (imdb != null) rankings.push(imdb);
  if (letterboxd != null) rankings.push(letterboxd);
  if (metacritic != null) rankings.push(metacritic);
  if (mubi != null) rankings.push(mubi);
  if (rottenTomatoes != null) rankings.push(rottenTomatoes);
  if (tmdb != null) rankings.push(tmdb);

  const length = rankings.length;
  const average = length > 0 ? R.sum(rankings) / length : 0;

  return length + 1 / average;
}

const updateOrCreateMovie = async (
  db,
  movie: TmdbMovie,
  rankings: { [id: string]: number }
) => {
  db
    .set(`movies.${movie.id}`, {
      id: movie.id,
      title: movie.title,
      backdrop: movie.backdrop_path || "",
      language: movie.original_language,
      originalTitle: movie.original_title,
      overview: movie.overview,
      poster: movie.poster_path || "",
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      tagline: movie.tagline ? movie.tagline : "",
      rankings,
      position: avgRank(rankings)
    })
    .write();

  return movie.id;
};

const searchMovies = async (
  searchItems: SearchInfo[]
): Promise<Array<?TmdbMovie>> => {
  const movies = [];

  for (let item of searchItems) {
    console.log(`Searching: ${item.title != null ? item.title : "no title"}`);
    movies.push(await tmdb.searchMovies(item));
  }

  return movies;
};

const getTmdbMovies = (
  scrapeMoviesFunc: () => Promise<SearchInfo[]>
) => async (): $await<Array<?TmdbMovie>> => {
  const items = await scrapeMoviesFunc();
  const movies = await searchMovies(items);
  return movies;
};

const scrapeMovieFuncs: Array<{
  scrape: () => Promise<Array<?TmdbMovie>>,
  source: Sources
}> = [
  { scrape: getTmdbMovies(bfi.getTopMovies), source: "bfi" },
  { scrape: getTmdbMovies(imdb.getTopMovies), source: "imdb" },
  { scrape: getTmdbMovies(letterboxd.getTopMovies), source: "letterboxd" },
  { scrape: getTmdbMovies(metacritic.getTopMovies), source: "metacritic" },
  { scrape: getTmdbMovies(mubi.getTopMovies), source: "mubi" },
  {
    scrape: getTmdbMovies(rottenTomatoes.getTopMovies),
    source: "rottenTomatoes"
  },
  { scrape: tmdb.getTopMovies, source: "tmdb" }
];

const scrapeMovies = async (db: *) => {
  const movieList = {};
  const rankingList = {};

  for (let scraper of scrapeMovieFuncs) {
    console.log(`\nSCRAPING: ${scraper.source.toUpperCase()}\n===============`);
    const movies = await scraper.scrape();
    movies.forEach((movie, index) => {
      if (movie) {
        movieList[movie.id] = movie;
        if (!rankingList[movie.id]) rankingList[movie.id] = {};
        rankingList[movie.id][scraper.source] = index + 1;
      }
    });
  }

  const tmdbIds = Object.keys(movieList);
  const movieIds = [];

  for (let id of tmdbIds) {
    movieIds.push(
      await updateOrCreateMovie(db, movieList[id], rankingList[id])
    );
  }

  console.log(`Updated ${movieIds.length} movies`);
};

module.exports = { scrapeMovies };
