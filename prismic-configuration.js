module.exports = {

  apiEndpoint: 'https://prismic-apiv2.prismic.io/v2/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  // This function will be used to generate links to Prismic.io documents
  // As your project grows, you should update this function according to your routes
  linkResolver(doc, ctx) {
    if (doc.type === 'test') return `/test/${doc.uid}`;
    return '/';
  },
};
