import './helpers/polyfills.js';
import createError from 'http-errors';
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import FileStore from 'session-file-store';
import routerLogin from './routes/login.js';
import routerDashboard from './routes/dashboard.js';
import routerAttendance from './routes/attendance.js';
import * as permissionFunctions from './helpers/functions.permissions.js';
import * as configFunctions from './helpers/functions.config.js';
import * as dateTimeFns from '@cityssm/utils-datetime';
import * as stringFns from '@cityssm/expressjs-server-js/stringFns.js';
import * as htmlFns from '@cityssm/expressjs-server-js/htmlFns.js';
import { version } from './version.js';
import { getSafeRedirectURL } from './helpers/functions.authentication.js';
import Debug from 'debug';
const debug = Debug(`monty:app:${process.pid}`);
const _dirname = '.';
export const app = express();
app.disable('X-Powered-By');
if (!configFunctions.getProperty('reverseProxy.disableEtag')) {
    app.set('etag', false);
}
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'ejs');
if (!configFunctions.getProperty('reverseProxy.disableCompression')) {
    app.use(compression());
}
app.use((request, _response, next) => {
    debug(`${request.method} ${request.url}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(csurf({
    cookie: true
}));
app.use(rateLimit({
    windowMs: 10000,
    max: 200
}));
const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
if (urlPrefix !== '') {
    debug('urlPrefix = ' + urlPrefix);
}
app.use(urlPrefix, express.static(path.join('public')));
app.use('/favicon.ico', express.static(path.join('public', 'favicon.ico')));
app.use(urlPrefix + '/lib/cityssm-bulma-js/bulma-js.js', express.static(path.join('node_modules', '@cityssm', 'bulma-js', 'dist', 'bulma-js.js')));
app.use(urlPrefix + '/lib/cityssm-bulma-webapp-js', express.static(path.join('node_modules', '@cityssm', 'bulma-webapp-js', 'dist')));
app.use(urlPrefix + '/lib/fa', express.static(path.join('node_modules', '@fortawesome', 'fontawesome-free')));
const sessionCookieName = configFunctions.getProperty('session.cookieName');
const FileStoreSession = FileStore(session);
app.use(session({
    store: new FileStoreSession({
        path: './data/sessions',
        logFn: Debug(`monty:session:${process.pid}`),
        retries: 20
    }),
    name: sessionCookieName,
    secret: configFunctions.getProperty('session.secret'),
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: configFunctions.getProperty('session.maxAgeMillis'),
        sameSite: 'strict'
    }
}));
app.use((request, response, next) => {
    if (Object.hasOwn(request.cookies, sessionCookieName) &&
        !Object.hasOwn(request.session, 'user')) {
        response.clearCookie(sessionCookieName);
    }
    next();
});
const sessionChecker = (request, response, next) => {
    if (Object.hasOwn(request.session, 'user') &&
        Object.hasOwn(request.cookies, sessionCookieName)) {
        next();
        return;
    }
    const redirectUrl = getSafeRedirectURL(request.originalUrl);
    response.redirect(`${urlPrefix}/login?redirect=${encodeURIComponent(redirectUrl)}`);
};
app.use((request, response, next) => {
    response.locals.buildNumber = version;
    response.locals.user = request.session.user;
    response.locals.csrfToken = request.csrfToken();
    response.locals.permissionFunctions = permissionFunctions;
    response.locals.configFunctions = configFunctions;
    response.locals.dateTimeFunctions = dateTimeFns;
    response.locals.stringFunctions = stringFns;
    response.locals.htmlFunctions = htmlFns;
    response.locals.urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
    next();
});
app.get(urlPrefix + '/', sessionChecker, (_request, response) => {
    response.redirect(urlPrefix + '/dashboard');
});
app.use(urlPrefix + '/dashboard', sessionChecker, routerDashboard);
if (configFunctions.includeAttendance()) {
    app.use(urlPrefix + '/attendance', sessionChecker, (request, response, next) => {
        if (permissionFunctions.hasAttendance(request.session.user)) {
            next();
            return;
        }
        response.redirect(`${urlPrefix}/dashboard?error=accessDenied`);
    }, routerAttendance);
}
if (configFunctions.getProperty('session.doKeepAlive')) {
    app.all(urlPrefix + '/keepAlive', (_request, response) => {
        response.json(true);
    });
}
app.use(urlPrefix + '/login', routerLogin);
app.get(urlPrefix + '/logout', (request, response) => {
    if (Object.hasOwn(request.session, 'user') &&
        Object.hasOwn(request.cookies, sessionCookieName)) {
        request.session.destroy(() => {
            response.clearCookie(sessionCookieName);
            response.redirect(urlPrefix + '/');
        });
    }
    else {
        response.redirect(urlPrefix + '/login');
    }
});
app.use((request, _response, next) => {
    debug(request.url);
    next(createError(404, 'File not found: ' + request.url));
});
export default app;
