const path = require("path");
const { slug } = require("./src/utils");

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const movieTemplate = path.resolve(`src/templates/movie.js`);
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            allMoviesJson {
              edges {
                node {
                  id
                  title
                  releaseDate
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) reject(result.errors);

        // Create pages for each markdown file.
        result.data.allMoviesJson.edges.forEach(({ node }) => {
          createPage({
            path: slug(node.title, node.releaseDate),
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
      })
    );
  });
};
