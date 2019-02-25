// @flow
import type { TVRankings, SearchInfo, Sources, TmdbTVShow } from "../types";
const fs = require("fs-extra");
const path = require("path");
const imdb = require("./imdb");
const metacritic = require("./metacritic");
const tmdb = require("./tmdb");
const { avgRank } = require("./utils");

function avgTVRank({ imdb, metacritic, tmdb }: TVRankings): number {
  let rankings = [];
  if (imdb != null) rankings.push(imdb);
  if (metacritic != null) rankings.push(metacritic);
  if (tmdb != null) rankings.push(tmdb);

  return avgRank(rankings);
}

const defaultRankings = {
  imdb: null,
  metacritic: null,
  tmdb: null
};

const updateOrCreateShow = async (show: TmdbTVShow, rankings: TVRankings) => {
  const jsonShow = {
    id: `${show.id}`,
    name: show.name,
    originalName: show.original_name,
    overview: show.overview,
    episodes: show.number_of_episodes,
    seasons: show.number_of_seasons,
    language: show.original_language,
    poster: show.poster_path || "",
    backdrop: show.backdrop_path || "",
    firstAirDate: show.first_air_date,
    lastAirDate: show.last_air_date,
    rankings: Object.assign({}, defaultRankings, rankings),
    score: avgTVRank(rankings)
  };
  // $FlowFixMe
  fs.writeFile(
    path.resolve(`./src/data/shows/${show.id}.json`),
    JSON.stringify(jsonShow, null, 2),
    err => {
      if (err) throw err;
    }
  );

  return show.id;
};

const searchShows = async (
  searchItems: SearchInfo[]
): Promise<Array<?TmdbTVShow>> => {
  const shows = [];

  for (let item of searchItems) {
    const show = await tmdb.searchTVShows(item);
    shows.push(show);
  }

  return shows;
};

const getTmdbTVShows = (
  scrapeShowsFunc: () => Promise<SearchInfo[]>
) => async (): Promise<Array<?TmdbTVShow>> => {
  const items = await scrapeShowsFunc();
  const shows = await searchShows(items);
  return shows;
};

const scrapeShowFuncs: Array<{
  scrape: () => Promise<Array<?TmdbTVShow>>,
  source: Sources
}> = [
  { scrape: getTmdbTVShows(metacritic.getTopShows), source: "metacritic" },
  { scrape: getTmdbTVShows(imdb.getTopShows), source: "imdb" },
  { scrape: tmdb.getTopTVShows, source: "tmdb" }
];

const scrapeTVShows = async () => {
  const showList = {};
  const rankingList = {};

  for (let scraper of scrapeShowFuncs) {
    console.log(`\nSCRAPING: ${scraper.source.toUpperCase()}\n===============`);
    const shows = await scraper.scrape();
    if (!shows.length) throw new Error(`Scraper failed for ${scraper.source}`);
    shows.forEach((show, index) => {
      if (show) {
        showList[show.id] = show;
        if (!rankingList[show.id]) rankingList[show.id] = {};
        rankingList[show.id][scraper.source] = index + 1;
      }
    });
  }

  const tmdbIds = Object.keys(showList);
  const showIds = [];

  for (let id of tmdbIds) {
    showIds.push(await updateOrCreateShow(showList[id], rankingList[id]));
  }

  console.log(`Updated ${showIds.length} shows`);
};

fs.emptyDirSync(path.resolve("./src/data/shows"));
scrapeTVShows().catch((e: Error) => console.error(e));
