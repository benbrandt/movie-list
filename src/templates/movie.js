// @flow
/* eslint-disable no-undef */
import React from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import Rankings from "../components/Rankings";
import type { MovieT } from "../types";

function runtime(mins: number) {
  const hours = Math.floor(mins / 60);
  const newMins = mins % (hours * 60);
  return `${hours}hr${hours > 1 ? "s" : ""} ${newMins}min${
    newMins > 1 ? "s" : ""
  }`;
}

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

type PropsT = { data: { moviesJson: MovieT } };
export default ({ data: { moviesJson: movie } }: PropsT) => (
  <Section
    style={
      movie.backdrop != null && {
        backgroundImage: `url('https://image.tmdb.org/t/p/w1280${
          movie.backdrop
        }')`
      }
    }
  >
    <Helmet title={movie.title} />
    <Overlay>
      {movie.poster != null && (
        <div>
          <Poster
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
          />
        </div>
      )}
      <Description>
        <Title>
          {movie.title}
          {movie.title !== movie.originalTitle && (
            <small>({movie.originalTitle})</small>
          )}
        </Title>
        <Subtitle>
          {movie.releaseDate.substr(0, 4)}
          {` / `}
          {runtime(movie.runtime)}
        </Subtitle>
        <Rankings rankings={movie.rankings} />
        {movie.tagline != null && <Tagline>{movie.tagline}</Tagline>}
        <Overview>{movie.overview}</Overview>
        <Tmdb>
          Film data from <a href="https://www.themoviedb.org/">TMDb</a>.
        </Tmdb>
      </Description>
    </Overlay>
  </Section>
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
        # metacritic
        mubi
        rottenTomatoes
        tmdb
      }
    }
  }
`;
