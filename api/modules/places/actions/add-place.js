/**
 * Response handler for places/add-place.
 * @module modules/places/actions/add-place
 */
import debugLogger from 'debugnyan';
import { PlaceRepository } from '../repositories';
import { UserPlaceRoleRepository } from '../../user-place-roles/repositories';
import { sendError } from '../../../common/route-utils';
import { getSignedPlaceJwt, validatePermissions } from '../../auth/auth';
import { createAttribute } from '../../attributes/actions/add-attribute';
import { ADD_PLACE } from '../../auth/permissions';

const debug = debugLogger('tippiq-places:places:actions:add-place');

/**
 * Response handler for adding a place.
 * @function responseHandler
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @returns {undefined}
 */
export default function responseHandler(req, res) {
  debug.debug('add place');
  validatePermissions(req, res, ADD_PLACE)
    .then(() => PlaceRepository
      .createPlace()
      .tap(place =>
        UserPlaceRoleRepository
          .create({
            tippiqId: req.user.userId,
            placeId: place.get('id'),
            role: 'place_admin',
          })
      )
      // optionally create attribute
      .tap(place =>
        req.body.placeAddress && createAttribute({
          place_id: place.get('id'),
          type: req.body.placeAddress.attributeType,
          data: req.body.placeAddress,
        })
      )
      .then(place => getSignedPlaceJwt({ placeId: place.get('id') }, place.get('private_key')))
      .then(placeToken =>
        res
          .cacheControl('no-store')
          .status(201)
          .send({
            success: true,
            message: 'Aangemaakt.',
            placeToken,
          })
      )
      .catch(e => {
        debug.error(`Error add place: ${e.message} ${e.stack}`);
        sendError(res, 500, 'Serverfout.');
      })
    );
}
