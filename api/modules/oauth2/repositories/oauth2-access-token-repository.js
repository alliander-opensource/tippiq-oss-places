/**
 * OAuth2AccessTokenRepository.
 * @module modules/oauth2/repositories/oauth2-access-token-repository
 */

import { OAuth2AccessToken } from '../models';
import BaseRepository from '../../../common/base-repository';

/**
 * A Repository for OAuth2 access token.
 * @class OAuth2AccessTokenRepository
 * @extends BaseRepository
 */
export class OAuth2AccessTokenRepository extends BaseRepository {
  /**
   * Construct a OAuth2AccessTokenRepository for OAuth2AccessTokens.
   * @constructs OAuth2AccessTokenRepository
   */
  constructor() {
    super(OAuth2AccessToken);
  }
}

export default new OAuth2AccessTokenRepository();
