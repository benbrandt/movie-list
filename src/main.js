// @flow
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const R = require("ramda");
const { scrapeMovies } = require("./scraper");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ movies: {} }).write();

const main = async () => {
  await scrapeMovies(db);

  fs.readFile(path.resolve("./db.json"), "utf8", (err, content) => {
    if (err) throw err;
    var parseJson = content ? JSON.parse(content) : { movies: {} };
    const { movies } = parseJson;
    const pairs = R.toPairs(movies);
    pairs.forEach(([k, v]) => {
      fs.writeFile(
        path.resolve(`./src/data/movies/${k}.json`),
        JSON.stringify(v, null, 2),
        err => {
          if (err) throw err;
        }
      );
    });
  });
};

main().catch((e: Error) => console.error(e));
