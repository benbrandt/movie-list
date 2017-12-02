// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const R = require("ramda");

const topMoviesUrl = page =>
  `http://letterboxd.com/films/ajax/by/rating/size/small/page/${page}/`;

async function getMovieList(url): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(url, {
    movies: {
      listItem: ".film-poster",
      data: {
        title: {
          attr: "data-film-name"
        },
        year: {
          attr: "data-film-release-year",
          convert: x => parseInt(x)
        }
      }
    }
  });

  return movies;
}

async function getTopMovies(): $await<SearchInfo[]> {
  let movies = [];
  const pages = [1, 2];

  for (let page of pages) {
    const list = await getMovieList(topMoviesUrl(page));
    if (!list.length) console.log(`Page ${page} failed.`);
    movies.push(list);
  }

  return R.take(100, R.flatten(movies));
}

module.exports = { getTopMovies };
