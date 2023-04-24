import * as configFunctions from '../helpers/functions.config.js';
import * as userFunctions from '../helpers/functions.user.js';
const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
const forbiddenStatus = 403;
const forbiddenJSON = {
    success: false,
    message: 'Forbidden'
};
const forbiddenRedirectURL = urlPrefix + '/dashboard/?error=accessDenied';
export function adminGetHandler(request, response, next) {
    if (userFunctions.userIsAdmin(request)) {
        next();
        return;
    }
    response.redirect(forbiddenRedirectURL);
}
export function adminPostHandler(request, response, next) {
    if (userFunctions.userIsAdmin(request)) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
export function updateGetHandler(request, response, next) {
    if (userFunctions.userCanUpdate(request)) {
        next();
        return;
    }
    response.redirect(forbiddenRedirectURL);
}
export function updatePostHandler(request, response, next) {
    if (userFunctions.userCanUpdate(request)) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
