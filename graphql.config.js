// if (!process.env.GITHUB_ACCESS_TOKEN) {
//   throw new Error('GITHUB_ACCESS_TOKEN required');
// }

module.exports = {
  schema: 'github.graphql',
  // schema: {
  //   "https://api.github.com/graphql": {
  //     headers: {
  //       Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  //     },
  //   },
  // },
  documents: 'src/**/*.{graphql,tsx,jsx,ts,js}',
  extensions: {
    languageService: {
      cacheSchemaFileForLookup: true,
    },
  },
};
