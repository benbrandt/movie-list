// @flow
import GatsbyLink from "gatsby-link";
import React from "react";
import styled from "@emotion/styled";

const Link = styled(GatsbyLink)`
  display: block;
  flex-basis: 25%;
  overflow: hidden;
  position: relative;
  text-decoration: none;

  @media (min-width: 64em) {
    flex-basis: 12.5%;
  }
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

type Props = {
  position: number,
  poster: ?string,
  slug: string,
  title: string
};
export default ({ position, poster, slug, title }: Props) => (
  <Link to={slug}>
    <Poster
      title={title}
      style={{
        background:
          poster != null
            ? `url('https://image.tmdb.org/t/p/w185${poster}')`
            : "black"
      }}
    />
    <Position>{position}</Position>
  </Link>
);
