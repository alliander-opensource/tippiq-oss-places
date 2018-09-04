/**
 * Point of contact for messages module.
 * @module modules/messages
 * @example import { sendRenderedEmail } from './send-rendered-email';
 */

import routes from './messages-routes';

export { sendRenderedEmail } from './actions/send-rendered-email';

export default {
  routes,
};
