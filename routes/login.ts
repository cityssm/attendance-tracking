import { isAbuser, recordAbuse } from '@cityssm/express-abuse-points'
import {
  Router,
  type RequestHandler,
  type Request,
  type Response
} from 'express'

import { getUser } from '../database/getUser.js'
import {
  authenticate,
  getSafeRedirectURL
} from '../helpers/functions.authentication.js'
import { getConfigProperty } from '../helpers/functions.config.js'
import type { ConfigTemporaryUserCredentials } from '../types/configTypes.js'

export const router = Router()

function getHandler(request: Request, response: Response): void {
  const sessionCookieName = getConfigProperty('session.cookieName')

  if (
    request.session.user !== undefined &&
    request.cookies[sessionCookieName] !== undefined
  ) {
    const redirectURL = getSafeRedirectURL(
      (request.query.redirect ?? '') as string
    )

    response.redirect(redirectURL)
  } else {
    response.render('login', {
      userName: '',
      message: '',
      isAbuser: false,
      redirect: request.query.redirect
    })
  }
}

async function postHandler(
  request: Request,
  response: Response
): Promise<void> {
  const userName = (
    typeof request.body.userName === 'string' ? request.body.userName : ''
  ) as string

  const passwordPlain = (
    typeof request.body.password === 'string' ? request.body.password : ''
  ) as string

  const unsafeRedirectURL = request.body.redirect

  const redirectURL = getSafeRedirectURL(
    typeof unsafeRedirectURL === 'string' ? unsafeRedirectURL : ''
  )

  let isAuthenticated = false
  let isTemporaryUser = false
  let userObject: AttendUser | undefined

  if (userName.startsWith('~~')) {
    isTemporaryUser = true

    const potentialUser = getConfigProperty('tempUsers').find(
      (possibleUser) => {
        return possibleUser.user.userName === userName
      }
    )

    if (
      (potentialUser?.user.canLogin ?? false) &&
      passwordPlain !== '' &&
      passwordPlain ===
        (potentialUser as ConfigTemporaryUserCredentials).password
    ) {
      isAuthenticated = true
      userObject = (potentialUser as ConfigTemporaryUserCredentials).user
    }
  } else if (userName !== '' && passwordPlain !== '') {
    isAuthenticated = await authenticate(userName, passwordPlain)
  }

  if (isAuthenticated && !isTemporaryUser) {
    const userNameLowerCase = userName.toLowerCase()
    userObject = await getUser(userNameLowerCase)
  }

  if (isAuthenticated && (userObject?.canLogin ?? false)) {
    request.session.user = userObject

    response.redirect(redirectURL)
  } else {
    recordAbuse(request)

    const isAbuserBoolean = await isAbuser(request)

    response.render('login', {
      userName,
      message: 'Login Failed',
      isAbuser: isAbuserBoolean,
      redirect: redirectURL
    })
  }
}

router
  .route('/')
  .get(getHandler)
  .post(postHandler as RequestHandler)

export default router
