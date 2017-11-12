// @flow
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { scrapeMovies } = require("./scraper");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ movies: {} }).write();

const main = async () => {
  await scrapeMovies(db);
};

main().catch((e: Error) => console.error(e));
