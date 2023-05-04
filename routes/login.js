import { Router } from 'express';
import * as configFunctions from '../helpers/functions.config.js';
import * as authenticationFunctions from '../helpers/functions.authentication.js';
import { getUser } from '../database/getUser.js';
export const router = Router();
function getHandler(request, response) {
    const sessionCookieName = configFunctions.getProperty('session.cookieName');
    if (request.session.user !== undefined &&
        request.cookies[sessionCookieName] !== undefined) {
        const redirectURL = authenticationFunctions.getSafeRedirectURL((request.query.redirect ?? ''));
        response.redirect(redirectURL);
    }
    else {
        response.render('login', {
            userName: '',
            message: '',
            redirect: request.query.redirect
        });
    }
}
async function postHandler(request, response) {
    const userName = (typeof request.body.userName === 'string' ? request.body.userName : '');
    const passwordPlain = (typeof request.body.password === 'string' ? request.body.password : '');
    const unsafeRedirectURL = request.body.redirect;
    const redirectURL = authenticationFunctions.getSafeRedirectURL(typeof unsafeRedirectURL === 'string' ? unsafeRedirectURL : '');
    let isAuthenticated = false;
    if (userName !== '' && passwordPlain !== '') {
        isAuthenticated = await authenticationFunctions.authenticate(userName, passwordPlain);
    }
    let userObject;
    if (isAuthenticated) {
        const userNameLowerCase = userName.toLowerCase();
        userObject = await getUser(userNameLowerCase);
    }
    if (isAuthenticated && (userObject?.canLogin ?? false)) {
        request.session.user = userObject;
        response.redirect(redirectURL);
    }
    else {
        response.render('login', {
            userName,
            message: 'Login Failed',
            redirect: redirectURL
        });
    }
}
router
    .route('/')
    .get(getHandler)
    .post(postHandler);
export default router;