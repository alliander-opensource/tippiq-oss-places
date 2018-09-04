import nodeUuid from 'node-uuid';

/**
 * @function validUserPlaceRole
 * @param {string} role Role to give the user
 * @param {uuid} tippiqId Id from tippiqId
 * @returns {{role: string, tippiqId: uuid}} User object
 */
export default function validUserPlaceRole(role = 'place_admin', tippiqId = nodeUuid.v4()) {
  return {
    role,
    tippiqId,
  };
}
