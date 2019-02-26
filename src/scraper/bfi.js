// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");

const topMoviesUrl =
  "https://www.bfi.org.uk/films-tv-people/sightandsoundpoll2012/directors/";

function splitTitleYear(string: string): SearchInfo {
  const parts = string.split("(");
  const title = parts[0];
  const year = parseInt(parts[1].slice(0, -1));
  return { title, year };
}

async function getTopMovies(): Promise<SearchInfo[]> {
  const {
    data: { movies }
  }: { data: { movies: { titleAndYear: string }[] } } = await scrapeIt(
    topMoviesUrl,
    {
      movies: {
        listItem: ".sas-film-list-row",
        data: {
          titleAndYear: {
            selector: ".show-for-small a"
          }
        }
      }
    }
  );

  return movies.map(({ titleAndYear }) => splitTitleYear(titleAndYear));
}

module.exports = { getTopMovies };
