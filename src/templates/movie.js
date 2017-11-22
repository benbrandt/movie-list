// @flow
/* eslint-disable no-undef */
import React from "react";
import Detail from "../components/Detail";
import type { MovieT } from "../types";

function runtime(mins: number) {
  const hours = Math.floor(mins / 60);
  const newMins = mins % (hours * 60);
  return `${hours}hr${hours > 1 ? "s" : ""} ${newMins}min${
    newMins > 1 ? "s" : ""
  }`;
}

type PropsT = { data: { moviesJson: MovieT } };
export default ({ data: { moviesJson: movie } }: PropsT) => (
  <Detail
    backdrop={movie.backdrop}
    originalTitle={movie.originalTitle}
    overview={movie.overview}
    poster={movie.poster}
    rankings={movie.rankings}
    subtitle={`${movie.releaseDate.substr(0, 4)} / ${runtime(movie.runtime)}`}
    tagline={movie.tagline}
    title={movie.title}
  />
);

// $FlowFixMe
export const query = graphql`
  query MovieById($id: String!) {
    moviesJson(id: { eq: $id }) {
      id
      backdrop
      originalTitle
      overview
      poster
      releaseDate
      runtime
      tagline
      title
      rankings {
        bfi
        imdb
        letterboxd
        metacritic
        mubi
        rottenTomatoes
        tmdb
      }
    }
  }
`;
