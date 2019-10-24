// @flow
import { Link, StaticQuery, graphql } from "gatsby";
import React from "react";
import styled from "@emotion/styled";
import Layout from "../components/layout";

type LogoT = { name: string, movies: string, shows?: string, img: string };
const logos: LogoT[] = [
  {
    name: "BFI",
    movies:
      "http://www.bfi.org.uk/films-tv-people/sightandsoundpoll2012/directors",
    img:
      "https://www.bfi.org.uk/films-tv-people/sites/all/themes/bfi2013/images/bfi_logo_transp.png"
  },
  {
    name: "IMDB",
    movies: "http://www.imdb.com/chart/top",
    shows:
      "http://www.imdb.com/search/title?num_votes=25000,&sort=user_rating,desc&title_type=tv_series",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/35/IMDb_logo.svg"
  },
  {
    name: "Letterboxd",
    movies: "https://letterboxd.com/films/by/rating/size/large/",
    img:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Letterboxd_logo_%28dark%29.png/600px-Letterboxd_logo_%28dark%29.png"
  },
  {
    name: "Metacritic",
    movies: "http://www.metacritic.com/browse/movies/score/metascore/all",
    shows: "http://www.metacritic.com/browse/tv/score/metascore/all",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/archive/4/48/20160817031851%21Metacritic_logo.svg"
  },
  {
    name: "Mubi",
    movies: "https://mubi.com/films",
    img: "https://assets.mubi.com/assets/one_mubi/logo-mobile@2x.png"
  },
  {
    name: "Rotten Tomatoes",
    movies: "https://www.rottentomatoes.com/top/bestofrt/",
    img:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Rotten_Tomatoes_logo.svg/400px-Rotten_Tomatoes_logo.svg.png"
  },
  {
    name: "TMDB",
    movies: "https://www.themoviedb.org/movie/top-rated",
    shows: "https://www.themoviedb.org/tv/top-rated",
    img:
      "https://www.themoviedb.org/assets/static_cache/8ce4f6ee3ea26190a7f21d1f9e7e9be2/images/v4/logos/182x162.png"
  }
];

const Column = styled("div")`
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover !important;
  display: flex;
  flex: 0 1 100%;
  flex-direction: column;
  width: 100%;
`;

const Section = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  width: 100%;

  @media (min-width: 48em) {
    flex-direction: row;
  }
`;

const Logos = styled("div")`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 80%;
`;

const Logo = styled("img")`
  max-height: 28px;
  padding: 0.5rem;
`;

const Header = styled("h1")`
  color: #eee;
  display: block;
  max-width: 16em;
  text-align: center;
  width: 80%;
`;

const Overlay = styled(Link)`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex: 0 1 100%;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: rgba(66, 66, 66, 0.5);
  }
`;

type Item = { node: { backdrop: ?string } };
const bg = (item: ?Item) =>
  item &&
  item.node.backdrop !== null && {
    backgroundImage: `url('https://image.tmdb.org/t/p/w1280${item.node
      .backdrop || ""}')`
  };

type PropsT = {
  allMoviesJson: {
    edges: Item[]
  },
  allShowsJson: {
    edges: Item[]
  }
};
export default () => {
  return (
    <StaticQuery
      query={graphql`
        query {
          allMoviesJson(limit: 1, sort: { fields: [score], order: DESC }) {
            edges {
              node {
                backdrop
              }
            }
          }
          allShowsJson(limit: 1, sort: { fields: [score], order: DESC }) {
            edges {
              node {
                backdrop
              }
            }
          }
        }
      `}
      render={({ allMoviesJson, allShowsJson }: PropsT) => (
        <Layout>
          <Column>
            <Section>
              <Column style={bg(allMoviesJson.edges[0])}>
                <Overlay to="/movies">
                  <Header>Movies</Header>
                  <Logos>
                    {logos
                      .filter(logo => !!logo.movies)
                      .map(logo => (
                        <Logo key={logo.name} src={logo.img} alt={logo.name} />
                      ))}
                  </Logos>
                </Overlay>
              </Column>
              <Column style={bg(allShowsJson.edges[0])}>
                <Overlay to="/shows">
                  <Header>TV Shows</Header>
                  <Logos>
                    {logos
                      .filter(logo => !!logo.shows)
                      .map(logo => (
                        <Logo key={logo.name} src={logo.img} alt={logo.name} />
                      ))}
                  </Logos>
                </Overlay>
              </Column>
            </Section>
          </Column>
        </Layout>
      )}
    />
  );
};
