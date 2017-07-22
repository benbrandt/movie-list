// @flow
import type { Rankings, RankingResult } from "./types";
const { Lokka } = require("lokka");
const { Transport } = require("lokka-transport-http");
const R = require("ramda");

// Set timezone to UTC (needed for Graphcool);
process.env.TZ = "UTC";
const headers = {
  Authorization: `Bearer ${process.env.GRAPHCOOL_TOKEN || ""}`
};

const client = new Lokka({
  transport: new Transport(
    `https://api.graph.cool/simple/v1/${process.env.GRAPHCOOL_ENDPOINT || ""}`,
    { headers }
  )
});

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
  const average = length > 0 ? R.sum(rankings) / length : 0;

  return length + 1 / average;
}

const getRankings = async (): Promise<Rankings[]> => {
  const result: {
    allRankings: Rankings[]
  } = await client.query(`{
    allRankings {
      id
      bfi
      imdb
      letterboxd
      metacritic
      mubi
      rottenTomatoes
      tmdb
    }
  }`);

  return result.allRankings;
};

const updateRank = async (id: string, position: number): Promise<string> => {
  const result: RankingResult = await client.mutate(`{
    ranking: updateRanking(
      id: "${id}",
      position: ${position}
    ) {
      id
    }
  }`);
  if (!result) console.log(result);
  return result.ranking.id;
};

const updateRankings = async (): Promise<string[]> => {
  const rankings = await getRankings();
  const rankingIds = [];

  for (let ranking of rankings) {
    const newRank = avgRank(ranking);
    console.log(newRank);
    rankingIds.push(await updateRank(ranking.id, newRank));
  }

  return rankingIds;
};

const rankings = async () => {
  const rankingIds = await updateRankings();
  console.log(`Updated ${rankingIds.length} rankings`);
};

module.exports = { rankings };
