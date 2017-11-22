// @flow
/* eslint-disable no-undef */
import React from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import Rankings from "../components/Rankings";
import type { TVShowT } from "../types";

const Section = styled("section")`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover !important;
  display: flex;
  width: 100%;
`;

const Overlay = styled("div")`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;

  @media (min-width: 48em) {
    align-items: flex-end;
    flex-direction: row;
  }
`;

const Poster = styled("img")`
  height: auto;
  max-width: 400px;
  width: 100%;
`;

const Description = styled("div")`
  color: #fff;
  max-width: 42em;
  width: 100%;

  @media (min-width: 48em) {
    padding-left: 1rem;
  }
`;

const Title = styled("h1")`
  line-height: 1;
  margin-bottom: 0;
  text-transform: uppercase;

  small {
    display: block;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled("h3")`
  line-height: 1.25;
  margin-top: 0;
`;

const Tagline = styled("h5")`
  font-size: 1rem;
  line-height: 1.25;
  margin-bottom: 0;
`;

const Overview = styled("p")`
  line-height: 1.5;
`;

const Tmdb = styled("span")`
  color: #ddd;
  font-size: 0.75rem;
  font-style: italic;

  a {
    color: #eee;
  }
`;

type PropsT = { data: { showsJson: TVShowT } };
export default ({ data: { showsJson: show } }: PropsT) => (
  <Section
    style={
      show.backdrop != null && {
        backgroundImage: `url('https://image.tmdb.org/t/p/w1280${
          show.backdrop
        }')`
      }
    }
  >
    <Helmet title={show.name} />
    <Overlay>
      {show.poster != null && (
        <div>
          <Poster
            src={`https://image.tmdb.org/t/p/w500${show.poster}`}
            alt={show.name}
          />
        </div>
      )}
      <Description>
        <Title>
          {show.name}
          {show.name !== show.originalName && (
            <small>({show.originalName})</small>
          )}
        </Title>
        <Subtitle>
          {show.firstAirDate.substr(0, 4)}
          {show.firstAirDate.substr(0, 4) !== show.lastAirDate.substr(0, 4) && (
            <span> &ndash; {show.lastAirDate.substr(0, 4)}</span>
          )}
        </Subtitle>
        <Rankings rankings={show.rankings} />
        <Tagline>
          Seasons: {show.seasons} / Episodes: {show.episodes}
        </Tagline>
        <Overview>{show.overview}</Overview>
        <Tmdb>
          TV Show data from <a href="https://www.themoviedb.org/">TMDb</a>.
        </Tmdb>
      </Description>
    </Overlay>
  </Section>
);

// $FlowFixMe
export const query = graphql`
  query ShowById($id: String!) {
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
