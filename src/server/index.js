// src/server/index.js
// import express from 'express';
// import cors from 'cors';
// import { renderToString } from 'react-dom/server';
// import { StaticRouter, matchPath } from 'react-router-dom';
// import React from 'react';
// import serialize from 'serialize-javascript';
// import App from '../shared/App';
const App = require('../shared/App');
const express = require('express');
const cors = require('cors');
const react = require('react');
const StaticRouter = require('react-router-dom/StaticRouter')
const serialize = require('serialize');
const renderToString = require('react-dom/server/renderToString');
// const express = reqiure('express');


const path = require('path');

// import routes from '../shared/routes';
const routes = require('../shared/routes');
// import { fetchPopularRepos } from '../shared/api';
const fetchPopularRepos = require('../shared/api');

const browserConfig = require('../../webpack.config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

console.log('server process.env.NODE_ENV --> --> ', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production') {
  console.log('NOT PRODUCTION !!!!');

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(browserConfig);

  const webpackMiddleware = webpackDevMiddleware(compiler, {
    publicPath: browserConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(webpackMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static('public'));
}

// We're going to serve up the public
// folder since that's where our
// client bundle.js file will end up.

// // // //
app.use(express.static('public'));

app.get('*', (req, res, next) => {
  const activeRoute = routes.find(route => matchPath(req.url, route)) || {};

  const promise = activeRoute.fetchInitialData
    ? activeRoute.fetchInitialData(req.path)
    : Promise.resolve();

  promise
    .then(data => {
      const context = { data };

      const markup = renderToString(
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>,
      );

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR with RR</title>
          <script src="/bundle.js" defer></script>
          <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
        </head>
 
        <body>
          <div id="app">${markup}</div>
        </body>
      </html>
    `);
    })
    .catch(next);
});

app.listen(PORT, () => {
  console.log('Server is listening on port: 3000');
});
