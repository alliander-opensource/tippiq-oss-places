/**
 * App constants
 * @module constants/App
 */

module.exports = {
  title: 'Tippiq Huis',
  description: 'Tippiq Huis.',
  head: {
    titleTemplate: 'Tippiq Huis: %s',
    meta: [
      { name: 'description', content: 'Tippiq Huis.' },
      { charset: 'utf-8' },
      { property: 'og:site_name', content: 'Tippiq' },
      { property: 'og:image', content: 'https://huis.tippiq.nl/logo.jpg' },
      { property: 'og:locale', content: 'nl_NL' },
      { property: 'og:title', content: 'Tippiq Huis' },
      { property: 'og:description', content: 'Tippiq Huis.' },
      { property: 'og:card', content: 'summary' },
      { property: 'og:site', content: '@tippiq' },
      { property: 'og:creator', content: '@tippiq' },
      { property: 'og:image:width', content: '200' },
      { property: 'og:image:height', content: '200' },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,600,400italic,800italic,800,700italic,700,600italic',
        type: 'text/css',
      }],
  },
};
