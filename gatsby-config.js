module.exports = {
  siteMetadata: {
    title: "Movie List"
  },
  plugins: [
    "gatsby-plugin-react-helmet",

    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "data",
        path: `${__dirname}/src/data/`
      }
    }
  ]
};
