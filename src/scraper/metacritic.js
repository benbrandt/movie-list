// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const R = require("ramda");

const topMoviesUrl =
  "http://www.metacritic.com/browse/movies/score/metascore/all";
const topTVUrl = page =>
  `http://www.metacritic.com/browse/tv/score/metascore/all?page=${page}`;

async function getTopMovieList(): Promise<SearchInfo[]> {
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

  return R.take(100, movies);
}

async function getTopShowList(url): Promise<SearchInfo[]> {
  const { shows }: { shows: SearchInfo[] } = await scrapeIt(url, {
    shows: {
      listItem: ".product_rows .product_row.season",
      data: {
        title: {
          selector: ".product_item.product_title a",
          convert: x => x.split(": Season")[0]
        }
      }
    }
  });

  return R.uniq(shows);
}

async function getTopMovies(): $await<SearchInfo[]> {
  let movies = [];

  while (!movies.length) {
    console.log("Trying Metacritic");
    await new Promise(resolve => setTimeout(resolve, 1000));
    movies = await getTopMovieList();
  }

  return movies;
}

async function getTopShows(): $await<SearchInfo[]> {
  let shows = [];
  let page = 0;

  while (shows.length < 100) {
    let list = [];
    while (!list.length) {
      console.log(`Trying page ${page}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      list = await getTopShowList(topTVUrl(page));
    }
    shows = R.uniq(shows.concat(list));
    page++;
  }

  return R.take(100, shows);
}

module.exports = { getTopMovies, getTopShows };
