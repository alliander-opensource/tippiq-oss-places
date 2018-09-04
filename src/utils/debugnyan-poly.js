import bunyan from 'bunyan';
import debug from 'debug';
import { assign, map, repeat } from 'lodash';

export const nameOptions =
  str =>
    assign(
      {},
      ...map(
        str.split(':'),
        (v, i) => ({ [i === 0 ? 'name' : `${repeat('sub', i - 1)}component`]: v })
      )
    );

export const levelOptions = name => ({
  level: (debug.enabled(name) ? bunyan.DEBUG : bunyan.FATAL + 1),
});

export default (name, options) =>
  bunyan.createLogger({
    ...options,
    ...nameOptions(name),
    ...{ level: (debug.enabled(name) ? bunyan.DEBUG : bunyan.FATAL + 1) },
  });
// bunyan.createLogger(Object.assign({}, options, nameOptions()));
