// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");

const topMoviesUrl = "https://www.rottentomatoes.com/top/bestofrt/";

function splitTitleYear(string: string): SearchInfo {
  const parts = string.split("(");
  const title = parts[0];
  const year = parseInt(parts[parts.length - 1].slice(0, -1));
  return { title, year };
}

async function getTopMovies(): Promise<SearchInfo[]> {
  const {
    movies
  }: { movies: { titleAndYear: string }[] } = await scrapeIt(topMoviesUrl, {
    movies: {
      listItem: "#top_movies_main .table > tr",
      data: {
        titleAndYear: {
          selector: ".articleLink"
        }
      }
    }
  });

  return movies.map(({ titleAndYear }) => splitTitleYear(titleAndYear));
}

module.exports = { getTopMovies };
