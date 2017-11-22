// @flow

import React from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import Rankings from "./Rankings";
import type { Rankings as MovieRankings, TVRankings } from "../types";

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

type Props = {
  backdrop: ?string,
  originalTitle: string,
  overview: string,
  poster: ?string,
  rankings: MovieRankings | TVRankings,
  subtitle: string,
  tagline: ?string,
  title: string
};

export default ({
  backdrop,
  originalTitle,
  overview,
  poster,
  rankings,
  subtitle,
  tagline,
  title
}: Props) => (
  <Section
    style={
      backdrop != null && {
        backgroundImage: `url('https://image.tmdb.org/t/p/w1280${backdrop}')`
      }
    }
  >
    <Helmet title={title} />
    <Overlay>
      {poster != null && (
        <div>
          <Poster
            src={`https://image.tmdb.org/t/p/w500${poster}`}
            alt={title}
          />
        </div>
      )}
      <Description>
        <Title>
          {title}
          {title !== originalTitle && <small>({originalTitle})</small>}
        </Title>
        <Subtitle>{subtitle}</Subtitle>
        <Rankings rankings={rankings} />
        {tagline != null && <Tagline>{tagline}</Tagline>}
        <Overview>{overview}</Overview>
        <Tmdb>
          Data from <a href="https://www.themoviedb.org/">TMDb</a>.
        </Tmdb>
      </Description>
    </Overlay>
  </Section>
);
