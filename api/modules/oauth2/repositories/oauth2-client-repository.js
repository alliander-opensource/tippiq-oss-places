/**
 * OAuth2ClientRepository.
 * @module modules/oauth2/repositories/oauth2-client-repository
 */

import { OAuth2Client } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for OAuth2 clients.
 * @class OAuth2ClientRepository
 * @extends BaseRepository
 */
export class OAuth2ClientRepository extends BaseRepository {
  /**
   * Construct a OAuth2ClientRepository for OAuth2Clients.
   * @constructs OAuth2ClientRepository
   */
  constructor() {
    super(OAuth2Client);
  }
}

export default new OAuth2ClientRepository();
