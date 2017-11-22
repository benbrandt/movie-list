// @flow
/* eslint-disable no-undef */
import React from "react";
import Pagination from "../components/Pagination";
import PosterLink from "../components/PosterLink";
import ListSection from "../components/ListSection";
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

export default ({ pathContext: { group, index, first, last } }: Props) => (
  <ListSection>
    {group.map(({ node: { id, firstAirDate, name, poster } }, i) => (
      <PosterLink
        key={id}
        position={(index - 1) * 48 + i + 1}
        poster={poster}
        slug={slug(name, firstAirDate, "shows")}
        title={name}
      />
    ))}

    <Pagination type="shows" index={index} first={first} last={last} />
  </ListSection>
);
