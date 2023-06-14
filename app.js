import './helpers/polyfills.js';
import path from 'node:path';
import { abuseCheck } from '@cityssm/express-abuse-points';
import * as htmlFns from '@cityssm/expressjs-server-js/htmlFns.js';
import * as stringFns from '@cityssm/expressjs-server-js/stringFns.js';
import * as dateTimeFns from '@cityssm/utils-datetime';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import Debug from 'debug';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import createError from 'http-errors';
import FileStore from 'session-file-store';
import { getSafeRedirectURL } from './helpers/functions.authentication.js';
import * as configFunctions from './helpers/functions.config.js';
import * as permissionFunctions from './helpers/functions.permissions.js';
import routerAdmin from './routes/admin.js';
import routerAttendance from './routes/attendance.js';
import routerDashboard from './routes/dashboard.js';
import routerLogin from './routes/login.js';
import routerPrint from './routes/print.js';
import routerReports from './routes/reports.js';
import routerSelfService from './routes/selfService.js';
import { version } from './version.js';
const debug = Debug(`monty:app:${process.pid}`);
if (configFunctions.getProperty('tempUsers').length > 0) {
    debug('Temporary user accounts currently active!');
}
export const app = express();
app.disable('X-Powered-By');
if (!configFunctions.getProperty('reverseProxy.disableEtag')) {
    app.set('etag', false);
}
app.set('views', path.join('views'));
app.set('view engine', 'ejs');
if (!configFunctions.getProperty('reverseProxy.disableCompression')) {
    app.use(compression());
}
app.use((request, _response, next) => {
    debug(`${request.method.toString()} ${request.url.toString()}`);
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
const abuseCheckHandler = abuseCheck({});
const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
if (urlPrefix !== '') {
    debug('urlPrefix = ' + urlPrefix);
}
app.use(urlPrefix, express.static(path.join('public')));
app.use('/favicon.ico', express.static(path.join('public', 'images', 'favicon', 'favicon.ico')));
app.use(urlPrefix + '/favicon.ico', express.static(path.join('public', 'images', 'favicon', 'favicon.ico')));
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
app.use(urlPrefix + '/reports', sessionChecker, routerReports);
app.use(urlPrefix + '/print', sessionChecker, routerPrint);
if (configFunctions.includeAttendance()) {
    app.use(urlPrefix + '/attendance', sessionChecker, (request, response, next) => {
        if (permissionFunctions.hasAttendance(request.session.user)) {
            next();
            return;
        }
        response.redirect(`${urlPrefix}/dashboard?error=accessDenied`);
    }, routerAttendance);
}
app.use(urlPrefix + '/admin', sessionChecker, (request, response, next) => {
    if (request.session.user?.isAdmin ?? false) {
        next();
        return;
    }
    response.redirect(`${urlPrefix}/dashboard?error=accessDenied`);
}, routerAdmin);
if (configFunctions.getProperty('session.doKeepAlive')) {
    app.all(urlPrefix + '/keepAlive', (_request, response) => {
        response.json(true);
    });
}
app.use(urlPrefix + '/login', abuseCheckHandler, routerLogin);
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
if (configFunctions.getProperty('features.selfService')) {
    app.use(urlPrefix + configFunctions.getProperty('settings.selfService.path'), abuseCheckHandler, routerSelfService);
}
app.use((request, _response, next) => {
    debug(request.url);
    next(createError(404, 'File not found: ' + request.url.toString()));
});
export default app;
