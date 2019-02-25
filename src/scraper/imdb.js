// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const R = require("ramda");

const topMoviesUrl = "http://www.imdb.com/chart/top/";
const topTVUrl = page =>
  `http://www.imdb.com/search/title?num_votes=25000,&sort=user_rating,desc&title_type=tv_series&page=${page}`;

async function getTopMovies(): Promise<SearchInfo[]> {
  const {
    data: { movies }
  }: { data: { movies: SearchInfo[] } } = await scrapeIt(topMoviesUrl, {
    movies: {
      listItem: ".titleColumn",
      data: {
        title: {
          selector: "a"
        },
        year: {
          selector: ".secondaryInfo",
          convert: x => parseInt(x.slice(1, -1))
        }
      }
    }
  });

  return R.take(100, movies);
}

async function getTopShowList(url): Promise<SearchInfo[]> {
  const {
    data: { shows }
  }: { data: { shows: SearchInfo[] } } = await scrapeIt(url, {
    shows: {
      listItem: ".lister-item",
      data: {
        title: {
          selector: ".lister-item-header a"
        }
      }
    }
  });

  return shows;
}

async function getTopShows(): Promise<SearchInfo[]> {
  let shows = [];
  const pages = [1, 2];

  for (let page of pages) {
    const list = await getTopShowList(topTVUrl(page));
    if (!list.length) throw new Error(`Page ${page} failed.`);
    shows.push(list);
  }
  // $FlowFixMe
  return R.take(100, R.flatten(shows));
}

module.exports = { getTopMovies, getTopShows };
