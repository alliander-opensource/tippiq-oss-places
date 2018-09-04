/**
 * Actions.
 * @module actions
 */
import {
  APP_CONFIG,
  CONSENT,
  AUTHORIZE,
  TEMPLATES_LOAD,
  POLICIES_SAVE,
  POLICIES_LOAD,
  PROFILE_LOAD,
  GET_SERVICE_PROVIDER,
  PLACE_ADD,
  RESIDENTS_LOAD,
  DISPLAY_NAME_LOAD,
  SERVICES_LOAD,
  ALL_SERVICES_LOAD,
  LOCATION_LOAD,
  USER_SESSION_LOGIN,
  USER_LOGOUT,
  ADDRESS_SUGGESTION_UPDATE,
  ADDRESS_SUGGESTIONS_RESET,
  ADDRESS_SUGGESTIONS_LOAD,
} from '../constants/ActionTypes';

/**
 * Give consent function.
 * @function giveConsent
 * @param {boolean} accept Accept consent flag.
 * @param {string} transactionId OAuth2 transactionId.
 * @returns {Object} Consent action.
 */
export function giveConsent(accept, transactionId) {
  return {
    types: [CONSENT],
    promise: api => api.post('/oauth2/authorization/decision',
      { data: { cancel: !accept, transaction_id: transactionId } }),
  };
}

/**
 * Get appConfig function.
 * @function getAppConfig
 * @returns {Object} Get appConfig action.
 */
export const getAppConfig = () => ({
  types: [APP_CONFIG],
  promise: api => api.get('/config'),
});

/**
 * Authorize function.
 * @function authorize
 * @param {Object} authorizationRequest AuthorizationRequest object from Service provider.
 * @returns {Object} Authorize action.
 */
export function authorize(authorizationRequest) {
  return {
    types: [AUTHORIZE],
    promise: api => api.get('/oauth2/authorization' +
      `?client_id=${authorizationRequest.clientId}` +
      `&response_type=${authorizationRequest.responseType}`
    ),
  };
}

/**
 * Get policy templates function.
 * @function getPolicyTemplates
 * @param {string} serviceProviderId Service provider to fetch the policy templates for.
 * @param {string[]} slugs A list of slugs to fetch the policy templates for.
 * @returns {Object} Get policy templates action.
 */
export function getPolicyTemplates(serviceProviderId, slugs = []) {
  let url = '';
  slugs.forEach(slug => {
    url += `&slugs=${slug}`;
  });

  return {
    types: [TEMPLATES_LOAD],
    promise: api => api.get(`/policy-templates?serviceProviderId=${serviceProviderId}${url}`),
  };
}

/**
 * Set policies function.
 * @function setPolicies
 * @param {object} policyTemplates Templates of the policies to be saved.
 * @param {string} clientId Client id.
 * @param {string} placeId Place id.
 * @returns {Object} Set policies action.
 */
export function setPolicies(policyTemplates, clientId, placeId) {
  return {
    types: [POLICIES_SAVE],
    promise: api => api.post(`/places/${placeId}/policies`,
      { data: policyTemplates, params: { clientId } }),
  };
}

/**
 * Get service provider function.
 * @function getServiceProvider
 * @param {string} id Service provider id
 * @returns {Object} Get service provider action.
 */
export function getServiceProvider(id) {
  return {
    types: [GET_SERVICE_PROVIDER],
    promise: api => api.get(`/service-provider/${id}`),
  };
}

/**
 * Get all policies for a user function.
 * @function getPolicies
 * @param {string} clientId Client id
 * @param {string} placeId Place id
 * @returns {Object} Get policies action.
 */
export function getPolicies(clientId, placeId) {
  return {
    types: [POLICIES_LOAD],
    promise: api => api.get(`/places/${placeId}/policies?clientId=${clientId}`),
  };
}

/**
 * Get profile of the authenticated user.
 * @function getProfile
 * @param {string} clientId Client to sign the get profile request with.
 * @param {string} userId User id to get the profile for.
 * @returns {Object} Get profile action.
 */
export function getProfile(clientId, userId) {
  return {
    types: [PROFILE_LOAD],
    promise: api => api.get(`/oauth2/profile/${clientId}/${userId}`),
  };
}

export const updateAddressSuggestionValue = (query, selected) => ({
  type: ADDRESS_SUGGESTION_UPDATE,
  query,
  selected,
});

/**
 * Get address suggestions
 * @function getAddressSuggestions
 * @returns {Object} Get address suggestions action.
 */
export function getAddressSuggestions(query) {
  return {
    types: [ADDRESS_SUGGESTIONS_LOAD],
    query,
    promise: api => api.get('/addresses/search', { params: { query } }),
  };
}

/**
 * Cleaer address suggestions
 * @function clearAddressSuggestions
 * @returns {Object} Clear address suggestions action.
 */
export function clearAddressSuggestions() {
  return { type: ADDRESS_SUGGESTIONS_RESET };
}

/**
 * Creates a new place, connects this place to the user and adds a role place-admin.
 * @function addPlace
 * @param {string} placeAddress Address of place
 * @returns {Object} Post add place action.
 */
export function addPlace(placeAddress) {
  return {
    types: [PLACE_ADD],
    promise: api => api.post('/places', { data: { placeAddress } }),
  };
}

/**
 * Get all residents for a place function.
 * @function getResidents
 * @param {string} placeId Place id
 * @returns {Object} Get residents action.
 */
export function getResidents(placeId) {
  return {
    types: [RESIDENTS_LOAD],
    promise: api => api.get(`/places/${placeId}/user-place-roles`),
  };
}

/**
 * Get display name for a place resident function.
 * @function getDisplayName
 * @param {string} placeId Place id
 * @param {string} userId User id
 * @returns {Object} Get display name action.
 */
export function getDisplayName(placeId, userId) {
  return {
    types: [DISPLAY_NAME_LOAD],
    promise: api => api.get(`/places/${placeId}/user-place-roles/${userId}/display-name`),
  };
}

/**
 * Get all services for a place function.
 * @function getServices
 * @param {string} placeId Place id
 * @returns {Object} Get services action.
 */
export function getServices(placeId) {
  return {
    types: [SERVICES_LOAD],
    promise: api => api.get(`/places/${placeId}/services`),
  };
}

/**
 * Get all services.
 * @function getAllServices
 * @returns {Object} Get all services action.
 */
export function getAllServices(placeId) {
  return {
    types: [ALL_SERVICES_LOAD],
    promise: api => api.get(`/places/${placeId}/services-except-active`),
  };
}

/**
 * Get location for a place function.
 * @function getLocation
 * @param {string} placeId Place id
 * @returns {Object} Get location action.
 */
export function getPlaceLocation(placeId) {
  return {
    types: [LOCATION_LOAD],
    promise: api =>
      api.get(`/places/${placeId}/attributes?type=tippiq_Tippiq_place_tippiq_location`),
  };
}

/**
 * Set session function.
 * @function setSession
 * @returns {Object} Set session action.
 */
export function setSession(token) {
  return { type: USER_SESSION_LOGIN, token };
}

/**
 * Logout function.
 * @function logout
 * @returns {Object} Logout action.
 */
export function logout() {
  return { type: USER_LOGOUT };
}
