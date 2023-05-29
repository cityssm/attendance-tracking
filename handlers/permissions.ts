import type { Request, Response, NextFunction } from 'express'

import * as configFunctions from '../helpers/functions.config.js'
import * as userFunctions from '../helpers/functions.user.js'

const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix')

export const forbiddenStatus = 403

export const forbiddenJSON = {
  success: false,
  message: 'Forbidden'
}

const forbiddenRedirectURL = urlPrefix + '/dashboard/?error=accessDenied'

export function adminGetHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (userFunctions.userIsAdmin(request)) {
    next()
    return
  }

  response.redirect(forbiddenRedirectURL)
}

export function adminPostHandler(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (userFunctions.userIsAdmin(request)) {
    next()
    return
  }

  response.status(forbiddenStatus).json(forbiddenJSON)
}
