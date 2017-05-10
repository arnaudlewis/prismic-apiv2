const Prismic = require('prismic-javascript').default;
const PrismicDOM = require('prismic-dom').default;
const request = require('request');
const PrismicConfig = require('./prismic-configuration');
const app = require('./config');

const PORT = app.get('port');

app.listen(PORT, () => {
  process.stdout.write(`Point your browser to: http://localhost:${PORT}\n`);
});

/*
 * Initialize prismic context and api
 */
app.use((req, res, next) => {
  Prismic.api(PrismicConfig.apiEndpoint, { accessToken: PrismicConfig.accessToken, req })
  .then((api) => {
    req.prismic = { api };
    res.locals.DOM = PrismicDOM;
    res.locals.ctx = {
      endpoint: PrismicConfig.apiEndpoint,
      linkResolver: PrismicConfig.linkResolver,
    };
    next();
  }).catch((err) => {
    const message = err.status === 404 ? 'There was a problem connecting to your API, please check your configuration file for errors.' : `Error 500: ${err.message}`;
    res.status(err.status).send(message);
  });
});

app.get('/', (req, res) => {
  res.redirect('/page/mydoc');
});

app.get('/page/:uid', (req, res) => {
  const uid = req.params.uid;
  req.prismic.api.getByUID('test', uid).then((content) => {
    if (content) {
      res.render('index', { doc: content });
    } else {
      res.status(404).send('404 not found');
    }
  });
});
