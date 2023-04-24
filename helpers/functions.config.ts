/* eslint-disable @typescript-eslint/indent, node/no-unpublished-import */

import './polyfills.js'

import { config } from '../data/config.js'

import type * as configTypes from '../types/configTypes'

// eslint-disable-next-line node/no-extraneous-import
import type { config as MSSQLConfig } from 'mssql'

/*
 * SET UP FALLBACK VALUES
 */

const configFallbackValues = new Map<string, unknown>()

configFallbackValues.set('application.applicationName', 'MonTY')
configFallbackValues.set(
  'application.backgroundURL',
  '/images/truck-background.jpg'
)
configFallbackValues.set('application.logoURL', '/images/hardhat.svg')
configFallbackValues.set('application.httpPort', 7000)
configFallbackValues.set('application.maximumProcesses', 4)

configFallbackValues.set('reverseProxy.disableCompression', false)
configFallbackValues.set('reverseProxy.disableEtag', false)
configFallbackValues.set('reverseProxy.urlPrefix', '')

configFallbackValues.set('session.cookieName', 'monty-user-sid')
configFallbackValues.set('session.secret', 'cityssm/monty')
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000)
configFallbackValues.set('session.doKeepAlive', false)

/*
 * Set up function overloads
 */

export function getProperty(propertyName: 'application.applicationName'): string

export function getProperty(propertyName: 'application.logoURL'): string
export function getProperty(propertyName: 'application.httpPort'): number
export function getProperty(propertyName: 'application.userDomain'): string

export function getProperty(
  propertyName: 'activeDirectory'
): configTypes.ConfigActiveDirectory

export function getProperty(
  propertyName: 'application.maximumProcesses'
): number

export function getProperty(
  propertyName: 'reverseProxy.disableCompression'
): boolean

export function getProperty(propertyName: 'reverseProxy.disableEtag'): boolean
export function getProperty(propertyName: 'reverseProxy.urlPrefix'): string

export function getProperty(propertyName: 'session.cookieName'): string
export function getProperty(propertyName: 'session.doKeepAlive'): boolean
export function getProperty(propertyName: 'session.maxAgeMillis'): number
export function getProperty(propertyName: 'session.secret'): string

export function getProperty(
  propertyName: 'settings.printPdf.contentDisposition'
): 'attachment' | 'inline'

export function getProperty(
  propertyName: 'mssql'
): MSSQLConfig

export function getProperty(propertyName: string): unknown {
  const propertyNameSplit = propertyName.split('.')

  let currentObject = config

  for (const propertyNamePiece of propertyNameSplit) {
    if (Object.hasOwn(currentObject, propertyNamePiece)) {
      currentObject = currentObject[propertyNamePiece]
      continue
    }

    return configFallbackValues.get(propertyName)
  }

  return currentObject
}

export const keepAliveMillis = getProperty('session.doKeepAlive')
  ? Math.max(
      getProperty('session.maxAgeMillis') / 2,
      getProperty('session.maxAgeMillis') - 10 * 60 * 1000
    )
  : 0
