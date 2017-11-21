// @flow
import R from "ramda";

export const avgRank = (rankings: number[]) => {
  const length = rankings.length;
  const average = length > 0 ? R.sum(rankings) / length : 0;

  return length + 1 / average;
};
