// @flow
import { graphql } from "gatsby";
import React from "react";
import Detail from "../components/Detail";
import Layout from "../components/layout";
import type { TVShowT } from "../types";

type PropsT = { data: { showsJson: TVShowT } };
export default ({ data: { showsJson: show } }: PropsT) => (
  <Layout>
    <Detail
      backdrop={show.backdrop}
      originalTitle={show.originalName}
      overview={show.overview}
      poster={show.poster}
      rankings={show.rankings}
      subtitle={`${show.firstAirDate.substr(0, 4)}
    ${
      show.firstAirDate.substr(0, 4) !== show.lastAirDate.substr(0, 4)
        ? ` – ${show.lastAirDate.substr(0, 4)}`
        : ""
    }`}
      tagline={`Seasons: ${show.seasons} / Episodes: ${show.episodes}`}
      title={show.name}
    />
  </Layout>
);

export const query = graphql`
  query($id: String!) {
    showsJson(id: { eq: $id }) {
      id
      backdrop
      episodes
      firstAirDate
      lastAirDate
      name
      originalName
      overview
      poster
      seasons
      rankings {
        imdb
        metacritic
        tmdb
      }
    }
  }
`;
