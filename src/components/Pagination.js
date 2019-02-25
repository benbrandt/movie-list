// @flow
import GatsbyLink from "gatsby-link";
import React from "react";
import styled from "@emotion/styled";

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

type Props = {
  index: number,
  first: boolean,
  last: boolean,
  type: string
};
export default ({ first, index, last, type }: Props) => (
  <PageNav>
    {!first && (
      <PageLink
        to={index - 1 === 1 ? `/${type}` : `/${type}/${(index - 1).toString()}`}
      >
        Prev
      </PageLink>
    )}
    {!last && (
      <PageLink to={`/${type}/${(index + 1).toString()}`}>Next</PageLink>
    )}
  </PageNav>
);
