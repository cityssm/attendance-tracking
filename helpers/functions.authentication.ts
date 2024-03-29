import { AdWebAuthConnector } from '@cityssm/ad-web-auth-connector'
import ActiveDirectory from 'activedirectory2'

import { getConfigProperty } from './functions.config.js'

const userDomain = getConfigProperty('application.userDomain')

const activeDirectoryConfig = getConfigProperty('activeDirectory')

async function authenticateViaActiveDirectory(
  userName: string,
  password: string
): Promise<boolean> {
  if (activeDirectoryConfig === undefined) {
    return false
  }

  return await new Promise<boolean>((resolve) => {
    try {
      const ad = new ActiveDirectory(activeDirectoryConfig)

      ad.authenticate(`${userDomain}\\${userName}`, password, (error, auth) => {
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

const adWebAuthConfig = getConfigProperty('adWebAuthConfig')
const adWebAuth =
  adWebAuthConfig === undefined
    ? undefined
    : new AdWebAuthConnector(adWebAuthConfig)

async function authenticateViaADWebAuth(
  userName: string,
  password: string
): Promise<boolean> {
  return (
    (await adWebAuth?.authenticate(`${userDomain}\\${userName}`, password)) ??
    false
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
  '/admin/tables',
  '/admin/users',
  '/attendance',
  '/reports'
])

export function getSafeRedirectURL(possibleRedirectURL = ''): string {
  const urlPrefix = getConfigProperty('reverseProxy.urlPrefix')

  if (typeof possibleRedirectURL === 'string') {
    const urlToCheck = possibleRedirectURL.startsWith(urlPrefix)
      ? possibleRedirectURL.slice(urlPrefix.length)
      : possibleRedirectURL

    const urlToCheckLowerCase = urlToCheck.toLowerCase()

    if (safeRedirects.has(urlToCheckLowerCase)) {
      return urlPrefix + urlToCheck
    }
  }

  return `${urlPrefix}/dashboard/`
}
