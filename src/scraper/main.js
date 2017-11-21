// @flow
// const { scrapeMovies } = require("./scrapeMovies");
const { scrapeTVShows } = require("./scrapeTVShows");

const main = async () => {
  // await scrapeMovies();
  await scrapeTVShows();
};

main().catch((e: Error) => console.error(e));
