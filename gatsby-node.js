const createPaginatedPages = require("gatsby-paginate");
const path = require("path");
const slugify = require("slugify");

// Add babel plugin
exports.modifyBabelrc = ({ babelrc }) =>
  Object.assign({}, babelrc, {
    plugins: babelrc.plugins.concat(["ramda"])
  });

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const movieTemplate = path.resolve(`src/templates/movie.js`);
    const showTemplate = path.resolve(`src/templates/show.js`);
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allMoviesJson(sort: { fields: [score], order: DESC }) {
              edges {
                node {
                  id
                  poster
                  releaseDate
                  title
                }
              }
            }
            allShowsJson(sort: { fields: [score], order: DESC }) {
              edges {
                node {
                  id
                  firstAirDate
                  name
                  poster
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) reject(result.errors);
        createPaginatedPages({
          edges: result.data.allMoviesJson.edges,
          createPage,
          pageTemplate: "src/templates/movies.js",
          pageLength: 48,
          pathPrefix: "movies"
        });
        createPaginatedPages({
          edges: result.data.allShowsJson.edges,
          createPage,
          pageTemplate: "src/templates/shows.js",
          pageLength: 48,
          pathPrefix: "shows"
        });
        // Create pages for each markdown file.
        result.data.allMoviesJson.edges.forEach(({ node }) => {
          createPage({
            path: `/movies/${slugify(
              `${node.title} ${node.releaseDate.substr(0, 4)}`,
              {
                remove: /[^\w\d\s]/g,
                lower: true
              }
            )}`,
            component: movieTemplate,
            // If you have a layout component at src/layouts/blog-layout.js
            // layout: "movie",
            // In your blog post template's graphql query, you can use path
            // as a GraphQL variable to query for data from the markdown file.
            context: {
              id: node.id
            }
          });
        });
        result.data.allShowsJson.edges.forEach(({ node }) => {
          createPage({
            path: `/shows/${slugify(
              `${node.name} ${node.firstAirDate.substr(0, 4)}`,
              {
                remove: /[^\w\d\s]/g,
                lower: true
              }
            )}`,
            component: showTemplate,
            // If you have a layout component at src/layouts/blog-layout.js
            // layout: "movie",
            // In your blog post template's graphql query, you can use path
            // as a GraphQL variable to query for data from the markdown file.
            context: {
              id: node.id
            }
          });
        });
      })
    );
  });
};
