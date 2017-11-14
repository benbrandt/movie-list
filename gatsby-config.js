module.exports = {
  siteMetadata: {
    title: "Movie List"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-emotion",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: `${__dirname}/src/data/`
      }
    },
    "gatsby-transformer-json"
  ]
};
