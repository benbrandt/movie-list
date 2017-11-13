// @flow
const { scrapeMovies } = require("./scraper");

const main = async () => {
  await scrapeMovies();
};

main().catch((e: Error) => console.error(e));
