// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const take = require("ramda/src/take");

const topMoviesUrl = "http://www.imdb.com/chart/top/";

async function getTopMovies(): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(topMoviesUrl, {
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

  return take(100, movies);
}

module.exports = { getTopMovies };
