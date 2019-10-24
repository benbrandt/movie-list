// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const R = require("ramda");

const topMoviesUrl = page =>
  `http://mubi.com/films?page=${page}&sort=popularity`;

async function getMovieList(url): Promise<SearchInfo[]> {
  const {
    data: { movies }
  }: { data: { movies: SearchInfo[] } } = await scrapeIt(url, {
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

  for (const page of pages) {
    const list = await getMovieList(topMoviesUrl(page));
    if (!list.length) throw new Error(`Page ${page} failed.`);
    movies.push(list);
  }
  // $FlowFixMe
  return R.take(100, R.flatten(movies));
}

module.exports = { getTopMovies };
