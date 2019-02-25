// @flow
/* eslint-disable no-undef */
import React from "react";
import Pagination from "../components/Pagination";
import PosterLink from "../components/PosterLink";
import ListSection from "../components/ListSection";
import { slug } from "../utils";

type Props = {
  pageContext: {
    group: Array<{
      node: {
        id: string,
        poster: ?string,
        releaseDate: string,
        title: string
      }
    }>,
    index: number,
    first: boolean,
    last: boolean
  }
};

export default ({ pageContext: { group, index, first, last } }: Props) => (
  <ListSection>
    {group.map(({ node: { id, title, poster, releaseDate } }, i) => (
      <PosterLink
        key={id}
        position={(index - 1) * 48 + i + 1}
        poster={poster}
        slug={slug(title, releaseDate)}
        title={title}
      />
    ))}
    <Pagination type="movies" index={index} first={first} last={last} />{" "}
  </ListSection>
);
