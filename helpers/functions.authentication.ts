import * as adWebAuth from '@cityssm/ad-web-auth-connector'
import ActiveDirectory from 'activedirectory2'

import * as configFunctions from './functions.config.js'

const userDomain = configFunctions.getProperty('application.userDomain')

const activeDirectoryConfig = configFunctions.getProperty('activeDirectory')

async function authenticateViaActiveDirectory(
  userName: string,
  password: string
): Promise<boolean> {
  return await new Promise((resolve) => {
    try {
      const ad = new ActiveDirectory(activeDirectoryConfig!)

      ad.authenticate(userDomain + '\\' + userName, password, (error, auth) => {
        let authenticated = false

        if ((error ?? '') === '') {
          authenticated = auth
        }

        resolve(authenticated)
      })
    } catch {
      resolve(false)
    }
  })
}

const adWebAuthConfig = configFunctions.getProperty('adWebAuthConfig')

async function authenticateViaADWebAuth(
  userName: string,
  password: string
): Promise<boolean> {
  return await adWebAuth.authenticate(
    userDomain + '\\' + userName,
    password,
    adWebAuthConfig
  )
}

const authenticateFunction =
  activeDirectoryConfig === undefined
    ? authenticateViaADWebAuth
    : authenticateViaActiveDirectory

export async function authenticate(
  userName: string,
  password: string
): Promise<boolean> {
  if ((userName ?? '') === '' || (password ?? '') === '') {
    return false
  }

  return await authenticateFunction(userName, password)
}

const safeRedirects = new Set([
  '/admin/employees',
  '/admin/users',
  '/attendance',
  '/reports'
])

export function getSafeRedirectURL(possibleRedirectURL = ''): string {
  const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix')

  if (typeof possibleRedirectURL === 'string') {
    const urlToCheck = possibleRedirectURL.startsWith(urlPrefix)
      ? possibleRedirectURL.slice(urlPrefix.length)
      : possibleRedirectURL

    const urlToCheckLowerCase = urlToCheck.toLowerCase()

    if (safeRedirects.has(urlToCheckLowerCase)) {
      return urlPrefix + urlToCheck
    }
  }

  return urlPrefix + '/dashboard/'
}
