// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const flatten = require("ramda/src/flatten");
const take = require("ramda/src/take");

const topMoviesUrl = page => `http://mubi.com/films?page=${page}/`;

async function getMovieList(url): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(url, {
    movies: {
      listItem: ".film-title-director-year",
      data: {
        title: {
          selector: ".film-title"
        },
        year: {
          selector: ".director-year",
          convert: x => parseInt(x.slice(-5))
        }
      }
    }
  });

  return movies;
}

async function getTopMovies(): Promise<SearchInfo[]> {
  const movies = [];
  const pages = [1, 2, 3, 4, 5];

  for (let page of pages) {
    movies.push(await getMovieList(topMoviesUrl(page)));
  }

  return take(100, flatten(movies));
}

module.exports = { getTopMovies };
