import {
  Router,
  type RequestHandler,
  type Request,
  type Response
} from 'express'

import { getUser } from '../database/getUser.js'
import * as authenticationFunctions from '../helpers/functions.authentication.js'
import * as configFunctions from '../helpers/functions.config.js'
import type * as recordTypes from '../types/recordTypes.js'

export const router = Router()

function getHandler(request: Request, response: Response): void {
  const sessionCookieName = configFunctions.getProperty('session.cookieName')

  if (
    request.session.user !== undefined &&
    request.cookies[sessionCookieName] !== undefined
  ) {
    const redirectURL = authenticationFunctions.getSafeRedirectURL(
      (request.query.redirect ?? '') as string
    )

    response.redirect(redirectURL)
  } else {
    response.render('login', {
      userName: '',
      message: '',
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

  const redirectURL = authenticationFunctions.getSafeRedirectURL(
    typeof unsafeRedirectURL === 'string' ? unsafeRedirectURL : ''
  )

  let isAuthenticated = false
  let isTemporaryUser = false
  let userObject: recordTypes.User | undefined

  if (userName.startsWith('~~')) {
    isTemporaryUser = true

    const potentialUser = configFunctions
      .getProperty('tempUsers')
      .find((possibleUser) => {
        return possibleUser.user.userName === userName
      })

    if (
      (potentialUser?.user.canLogin ?? false) &&
      passwordPlain !== '' &&
      passwordPlain === potentialUser!.password
    ) {
      isAuthenticated = true
      userObject = potentialUser!.user
    }
  } else if (userName !== '' && passwordPlain !== '') {
    isAuthenticated = await authenticationFunctions.authenticate(
      userName,
      passwordPlain
    )
  }

  if (isAuthenticated && !isTemporaryUser) {
    const userNameLowerCase = userName.toLowerCase()
    userObject = await getUser(userNameLowerCase)
  }

  if (isAuthenticated && (userObject?.canLogin ?? false)) {
    request.session.user = userObject

    response.redirect(redirectURL)
  } else {
    response.render('login', {
      userName,
      message: 'Login Failed',
      redirect: redirectURL
    })
  }
}

router
  .route('/')
  .get(getHandler)
  .post(postHandler as RequestHandler)

export default router
