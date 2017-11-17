// @flow
import GatsbyLink from "gatsby-link";
import React from "react";
import styled from "react-emotion";

const Header = styled("header")`
  background: #111;
  display: flex;
  height: 5vh;
  justify-content: space-between;
`;

const ExternalLink = styled("a")`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 0.875rem;
  font-weight: bold;
  opacity: 1;
  padding-left: 1rem;
  padding-right: 1rem;
  text-decoration: none;
  transition: color 0.15s ease-in, opacity 0.15s ease-in;

  &:hover {
    opacity: 0.5;
    transition: opacity 0.15s ease-in;
  }
`;

const Link = styled(GatsbyLink)`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 0.875rem;
  font-weight: bold;
  opacity: 1;
  padding-left: 1rem;
  padding-right: 1rem;
  text-decoration: none;
  transition: color 0.15s ease-in, opacity 0.15s ease-in;

  &:link,
  &:visited {
    transition: color 0.15s ease-in;
  }

  &:hover {
    transition: color 0.15s ease-in;
  }

  &:active {
    opacity: 0.8;
    transition: opacity 0.15s ease-out, color 0.15s ease-in;
  }

  &:focus {
    transition: color 0.15s ease-in;
    outline: 1px dotted currentColor;
  }

  &:hover,
  &:focus {
    opacity: 0.5;
    transition: opacity 0.15s ease-in;
  }
`;

export default () => (
  <Header>
    <Link to="/">Movie List</Link>
    <ExternalLink href="https://benjaminbrandt.com">by Ben Brandt</ExternalLink>
  </Header>
);
