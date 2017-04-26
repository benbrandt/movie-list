// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const take = require("ramda/src/take");

const topMoviesUrl =
  "http://www.metacritic.com/browse/movies/score/metascore/all";

async function getTopMovies(): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(topMoviesUrl, {
    movies: {
      listItem: ".list.score .summary_row",
      data: {
        title: {
          selector: ".title_wrapper .title a"
        },
        year: {
          selector: ".date_wrapper span:first-child",
          convert: x => parseInt(x.slice(-4))
        }
      }
    }
  });
  console.log(topMoviesUrl);
  return take(100, movies);
}

module.exports = { getTopMovies };
