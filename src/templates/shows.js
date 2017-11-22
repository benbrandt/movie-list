// @flow
/* eslint-disable no-undef */
import GatsbyLink from "gatsby-link";
import React from "react";
import styled from "react-emotion";
import { slug } from "../utils";

type Props = {
  pathContext: {
    group: Array<{
      node: {
        id: string,
        firstAirDate: string,
        poster: ?string,
        name: string
      }
    }>,
    index: number,
    first: boolean,
    last: boolean
  }
};

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

const PageNav = styled("div")`
  display: flex;
  width: 100%;
`;

const PageLink = styled(GatsbyLink)`
  background: #111;
  color: #fff;
  display: block;
  flex-grow: 1;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  transition: 0.25s background;

  &:hover,
  &:focus {
    background: #333;
  }

  &:active {
    background: #444;
  }
`;

const Section = styled("section")`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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

export default ({ pathContext: { group, index, first, last } }: Props) => (
  <Section>
    {group.map(({ node: { id, firstAirDate, name, poster } }, i) => (
      <Link key={id} to={slug(name, firstAirDate, "shows")}>
        <Poster
          title={name}
          style={{
            background:
              poster != null
                ? `url('https://image.tmdb.org/t/p/w185${poster}')`
                : "black"
          }}
        />
        <Position>{(index - 1) * 48 + i + 1}</Position>
      </Link>
    ))}

    <PageNav>
      {!first && (
        <PageLink to={index - 1 === 1 ? "" : (index - 1).toString()}>
          Prev
        </PageLink>
      )}
      {!last && <PageLink to={(index + 1).toString()}>Next</PageLink>}
    </PageNav>
  </Section>
);
