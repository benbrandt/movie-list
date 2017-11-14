// @flow
/* eslint-disable no-undef */
import GatsbyLink from "gatsby-link";
import React from "react";
import styled from "react-emotion";
import slugify from "slugify";

type Props = {
  data: {
    allMoviesJson: {
      edges: Array<{
        node: {
          id: string,
          poster: ?string,
          releaseDate: string,
          title: string
        }
      }>
    }
  }
};

const Link = styled(GatsbyLink)`
  overflow: hidden;
  position: relative;
  text-decoration: none;
`;

const Section = styled("section")`
  display: flex;
  flex-wrap: wrap;
`;

const Poster = styled("div")`
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover !important;
  padding-bottom: 150%;
  transform: translateZ(0);
  transition: transform 0.25s ease-out;

  &:hover,
  &:focus {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const Position = styled("span")`
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  height: 1rem;
  left: 0;
  position: absolute;
  text-align: center;
  top: 0;
  width: 2rem;
`;

export default ({ data: { allMoviesJson: { edges } } }: Props) => (
  <Section>
    {edges.map(({ node: { id, title, poster, releaseDate } }, index) => (
      <Link key={id} to={`/${slugify(`${title} ${releaseDate.substr(0, 4)}`)}`}>
        <Poster
          title={title}
          style={{
            background:
              poster != null
                ? `url('https://image.tmdb.org/t/p/w185${poster}')`
                : "black"
          }}
        />
        <Position>{index + 1}</Position>
      </Link>
    ))}
  </Section>
);

// $FlowFixMe
export const query = graphql`
  query AllMovies {
    allMoviesJson(sort: { fields: position, order: DESC }) {
      edges {
        node {
          id
          poster
          releaseDate
          title
        }
      }
    }
  }
`;
