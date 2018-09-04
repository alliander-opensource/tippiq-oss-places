import debugLogger from 'debugnyan';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.client.dev';
import { host, port as frontendPort } from '../src/config';

const debug = debugLogger('tippiq-places:webpack');

const port = parseInt(frontendPort) + 1;

const serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: false,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};

const compiler = webpack(config);
const app = express();

app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

app.listen(port, (err) => {
  if (err) {
    debug.error(err);
  } else {
    debug.info({ port }, '🚧 Webpack development server');
  }
});
