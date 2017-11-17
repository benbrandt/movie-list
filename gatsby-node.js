const path = require("path");
const slugify = require("slugify");

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
            path: `/${slugify(
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
      })
    );
  });
};
