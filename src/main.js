// @flow
const scraper = require("./scraper");

const main = async () => {
  const indexes = [0, 1, 2, 3, 4, 5];
  for (let index of indexes) {
    await scraper.scrapeMovies(index);
  }
  await scraper.rankings();
};

main().catch((e: Error) => console.error(e));
