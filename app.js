const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const Cookies = require('cookies');
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
  Prismic.getApi(PrismicConfig.apiEndpoint)
  .then((api) => {
    req.prismic = { api };
    res.locals.RichText = PrismicDOM.RichText;
    res.locals.Link = PrismicDOM.Link;
    res.locals.Date = PrismicDOM.Date;
    res.locals.ctx = {
      endpoint: PrismicConfig.apiEndpoint,
      linkResolver: PrismicConfig.linkResolver,
    };
    next();
  }).catch((err) => {
    next(err);
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

app.get('/preview', (req, res, next) => {
  const token = req.query.token;
  if (token) {
    req.prismic.api.previewSession(token, PrismicConfig.linkResolver, '/').then((url) => {
      const cookies = new Cookies(req, res);
      cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
      res.redirect(301, url);
    }).catch((err) => {
      next(err);
    });
  } else {
    res.send(400, 'Missing token from querystring');
  }
});
