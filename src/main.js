// @flow
const { scrapeMovies } = require("./scraper");
const { rankings } = require("./rankings");

const main = async () => {
  await scrapeMovies();
  await rankings();
};

main().catch((e: Error) => console.error(e));
