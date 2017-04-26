// @flow
import type { Rankings } from "./types";
const sum = require("ramda/src/sum");

function avgRank({
  bfi,
  imdb,
  letterboxd,
  metacritic,
  mubi,
  rottenTomatoes,
  tmdb
}: Rankings): number {
  let rankings = [];
  if (bfi) rankings.push(bfi);
  if (imdb) rankings.push(imdb);
  if (letterboxd) rankings.push(letterboxd);
  if (metacritic) rankings.push(metacritic);
  if (mubi) rankings.push(mubi);
  if (rottenTomatoes) rankings.push(rottenTomatoes);
  if (tmdb) rankings.push(tmdb);

  const length = rankings.length;
  const average = length > 0 ? sum(rankings) / length : 0;

  return length + 1 / average;
}

module.exports = { avgRank };
