import path from 'node:path'

import { abuseCheck } from '@cityssm/express-abuse-points'
import dateTimeFns from '@cityssm/utils-datetime'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import Debug from 'debug'
import express from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import createError from 'http-errors'
import FileStore from 'session-file-store'

import { getSafeRedirectURL } from './helpers/functions.authentication.js'
import configFunctions, {
  getConfigProperty,
  includeAttendance
} from './helpers/functions.config.js'
import permissionFunctions, {
  hasAttendance
} from './helpers/functions.permissions.js'
import routerAdmin from './routes/admin.js'
import routerAttendance from './routes/attendance.js'
import routerDashboard from './routes/dashboard.js'
import routerLogin from './routes/login.js'
import routerPrint from './routes/print.js'
import routerReports from './routes/reports.js'
import routerSelfService from './routes/selfService.js'
import { version } from './version.js'

const debug = Debug(`attendance-tracking:app:${process.pid}`)

/*
 * INITIALIZE APP
 */

if (getConfigProperty('tempUsers').length > 0) {
  debug('Temporary user accounts currently active!')
}

export const app = express()

app.disable('X-Powered-By')

if (!getConfigProperty('reverseProxy.disableEtag')) {
  app.set('etag', false)
}

// View engine setup
app.set('views', path.join('views'))
app.set('view engine', 'ejs')

if (!getConfigProperty('reverseProxy.disableCompression')) {
  app.use(compression())
}

app.use((request, _response, next) => {
  debug(`${request.method} ${request.url}`)
  next()
})

app.use(express.json())

app.use(
  express.urlencoded({
    extended: false
  })
)

app.use(cookieParser())
app.use(
  csurf({
    cookie: true
  })
)

/*
 * Rate Limiter
 */

app.use(
  rateLimit({
    windowMs: 10_000,
    max: 200
  })
)

/*
 * Abuse Check
 */

const abuseCheckHandler = abuseCheck()

/*
 * STATIC ROUTES
 */

const urlPrefix = getConfigProperty('reverseProxy.urlPrefix')

if (urlPrefix !== '') {
  debug(`urlPrefix = ${urlPrefix}`)
}

app.use(urlPrefix, express.static(path.join('public')))

if (!configFunctions.isLogoOverwritten) {
  app.use(
    '/favicon.ico',
    express.static(path.join('public', 'images', 'favicon', 'favicon.ico'))
  )

  app.use(
    `${urlPrefix}/favicon.ico`,
    express.static(path.join('public', 'images', 'favicon', 'favicon.ico'))
  )
}

app.use(
  `${urlPrefix}/lib/cityssm-bulma-js/bulma-js.js`,
  express.static(
    path.join('node_modules', '@cityssm', 'bulma-js', 'dist', 'bulma-js.js')
  )
)

app.use(
  `${urlPrefix}/lib/cityssm-bulma-webapp-js`,
  express.static(
    path.join('node_modules', '@cityssm', 'bulma-webapp-js', 'dist')
  )
)

app.use(
  `${urlPrefix}/lib/fa`,
  express.static(path.join('node_modules', '@fortawesome', 'fontawesome-free'))
)

/*
 * SESSION MANAGEMENT
 */

const sessionCookieName: string = getConfigProperty('session.cookieName')

const FileStoreSession = FileStore(session)

// Initialize session
app.use(
  session({
    store: new FileStoreSession({
      path: './data/sessions',
      logFn: Debug(`attendance-tracking:session:${process.pid}`),
      retries: 20
    }),
    name: sessionCookieName,
    secret: getConfigProperty('session.secret'),
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: getConfigProperty('session.maxAgeMillis'),
      sameSite: 'strict'
    }
  })
)

// Clear cookie if no corresponding session
app.use((request, response, next) => {
  if (
    Object.hasOwn(request.cookies as object, sessionCookieName) &&
    !Object.hasOwn(request.session, 'user')
  ) {
    response.clearCookie(sessionCookieName)
  }

  next()
})

// Redirect logged in users
const sessionChecker = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void => {
  if (
    Object.hasOwn(request.session, 'user') &&
    Object.hasOwn(request.cookies as object, sessionCookieName)
  ) {
    next()
    return
  }

  const redirectUrl = getSafeRedirectURL(request.originalUrl)

  response.redirect(
    `${urlPrefix}/login?redirect=${encodeURIComponent(redirectUrl)}`
  )
}

/*
 * ROUTES
 */

// Make the user and config objects available to the templates

app.use((request, response, next) => {
  response.locals.buildNumber = version

  response.locals.user = request.session.user
  response.locals.csrfToken = request.csrfToken()

  response.locals.permissionFunctions = permissionFunctions
  response.locals.configFunctions = configFunctions
  response.locals.dateTimeFunctions = dateTimeFns

  response.locals.urlPrefix = getConfigProperty('reverseProxy.urlPrefix')

  next()
})

app.get(`${urlPrefix}/`, sessionChecker, (_request, response) => {
  response.redirect(`${urlPrefix}/dashboard`)
})

app.use(`${urlPrefix}/dashboard`, sessionChecker, routerDashboard)

app.use(`${urlPrefix}/reports`, sessionChecker, routerReports)

app.use(`${urlPrefix}/print`, sessionChecker, routerPrint)

if (includeAttendance()) {
  app.use(
    `${urlPrefix}/attendance`,
    sessionChecker,
    (request, response, next) => {
      if (hasAttendance(request.session.user)) {
        next()
        return
      }

      response.redirect(`${urlPrefix}/dashboard?error=accessDenied`)
    },
    routerAttendance
  )
}

app.use(
  `${urlPrefix}/admin`,
  sessionChecker,
  (request, response, next) => {
    if (request.session.user?.isAdmin ?? false) {
      next()
      return
    }

    response.redirect(`${urlPrefix}/dashboard?error=accessDenied`)
  },
  routerAdmin
)

if (getConfigProperty('session.doKeepAlive')) {
  app.all(`${urlPrefix}/keepAlive`, (_request, response) => {
    response.json(true)
  })
}

app.use(`${urlPrefix}/login`, abuseCheckHandler, routerLogin)

app.get(`${urlPrefix}/logout`, (request, response) => {
  if (
    Object.hasOwn(request.session, 'user') &&
    Object.hasOwn(request.cookies as object, sessionCookieName)
  ) {
    request.session.destroy(() => {
      response.clearCookie(sessionCookieName)
      response.redirect(`${urlPrefix}/`)
    })
  } else {
    response.redirect(`${urlPrefix}/login`)
  }
})

if (getConfigProperty('features.selfService')) {
  app.use(
    urlPrefix + getConfigProperty('settings.selfService.path'),
    abuseCheckHandler,
    routerSelfService
  )
}

// Catch 404 and forward to error handler
app.use((request, _response, next) => {
  debug(request.url)
  next(createError(404, `File not found: ${request.url}`))
})

export default app
