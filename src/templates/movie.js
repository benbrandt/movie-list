// @flow
import React from "react";
import Helmet from "react-helmet";
import type { MovieT } from "../types";

function runtime(mins: number) {
  const hours = Math.floor(mins / 60);
  const newMins = mins % (hours * 60);
  return `${hours}hr${hours > 1 ? "s" : ""} ${newMins}min${
    newMins > 1 ? "s" : ""
  }`;
}

type PropsT = { data: { movie: MovieT } };
class MovieTemplate extends React.Component<PropsT> {
  render() {
    console.log(this.props.data);
    const { moviesJson: movie, site } = this.props.data;

    return (
      <section
        style={
          movie.backdrop != null
            ? {
                backgroundImage: `url('https://image.tmdb.org/t/p/w1280${
                  movie.backdrop
                }')`
              }
            : { backgroundColor: "#333" }
        }
      >
        <Helmet title={`${movie.title} | ${site.siteMetadata.title}`} />
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster || ""}`}
            alt={movie.title}
            style={{ width: "calc(100% / 3)" }}
          />
          <div>
            <div className="description">
              <h1>
                {movie.title}
                {movie.title !== movie.originalTitle && (
                  <small>({movie.originalTitle})</small>
                )}
              </h1>
              <h3>
                {movie.releaseDate.substr(0, 4)}
                {` / `}
                {runtime(movie.runtime)}
              </h3>
              {/* <Rankings rankings={movie.ranking} /> */}
              {movie.tagline != null && <h5>{movie.tagline}</h5>}
              <p>{movie.overview}</p>
              <span className="tmdb">
                Film data from <a href="https://www.themoviedb.org/">TMDb</a>.
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default MovieTemplate;

export const pageQuery = graphql`
  query MovieById($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    moviesJson(id: { eq: $id }) {
      id
      backdrop
      originalTitle
      overview
      poster
      releaseDate
      runtime
      tagline
      title
    }
  }
`;
