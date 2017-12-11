// @flow
import R from "ramda";
import React from "react";
import styled from "react-emotion";
import type { Rankings, TVRankings } from "../types";

type Props = { rankings: Rankings | TVRankings };

type Logo = { label: string, img: string };
const logos: { [id: string]: Logo } = {
  bfi: {
    label: "BFI",
    img:
      "https://pbs.twimg.com/profile_images/884711689035370496/S3-Agwpb_bigger.jpg"
  },
  imdb: {
    label: "IMDB",
    img:
      "https://pbs.twimg.com/profile_images/780796992611942405/qj7ytv9v_bigger.jpg"
  },
  letterboxd: {
    label: "Letterboxd",
    img:
      "https://pbs.twimg.com/profile_images/2529194120/f383glyd16f8sm5e0wnv_bigger.png"
  },
  metacritic: {
    label: "Metacritic",
    img:
      "https://pbs.twimg.com/profile_images/527528131171590144/EQXs3lpX_bigger.png"
  },
  mubi: {
    label: "Mubi",
    img:
      "https://pbs.twimg.com/profile_images/536840176912187393/XFLZlqJt_bigger.png"
  },
  rottenTomatoes: {
    label: "RottenTomatoes",
    img:
      "https://pbs.twimg.com/profile_images/811034417850220544/NDVQTlyz_bigger.jpg"
  },
  tmdb: {
    label: "The Movie DB",
    img:
      "https://pbs.twimg.com/profile_images/789117657714831361/zGfknUu8_bigger.jpg"
  }
};

const Wrapper = styled("div")`
  display: flex;
  flex-wrap: wrap;
`;
const Image = styled("img")`
  margin-right: 0.25rem;
  max-width: 1.25rem;
`;
const Position = styled("span")`
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  color: #333;
  display: flex;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  padding-right: 0.33rem;
`;

export default ({ rankings }: Props) => {
  // $FlowFixMe
  const sortedRankings = R.sortBy(R.prop(1), R.toPairs(rankings));
  return (
    <Wrapper>
      {sortedRankings.map(
        ([source, value]) =>
          value &&
          logos[source] && (
            <Position key={source}>
              <Image
                src={logos[source].img}
                alt={logos[source].label}
                title={logos[source].label}
              />
              {value}
            </Position>
          )
      )}
    </Wrapper>
  );
};
