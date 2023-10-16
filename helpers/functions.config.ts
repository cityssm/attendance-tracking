// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import './polyfills.js'

// eslint-disable-next-line n/no-missing-import
import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector/types.js'
import type { Configuration as AvantiConfig } from '@cityssm/avanti-api'
import type { config as MSSQLConfig } from 'mssql'

import { config } from '../data/config.js'
import type {
  ConfigActiveDirectory,
  ConfigEmployeeEligibilityFunction,
  ConfigEmployeeSortKeyFunction,
  ConfigTemporaryUserCredentials
} from '../types/configTypes.js'

/*
 * SET UP FALLBACK VALUES
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
const property_session_maxAgeMillis = 'session.maxAgeMillis'

const configFallbackValues = new Map<string, unknown>()

configFallbackValues.set('application.applicationName', 'MonTY')
configFallbackValues.set(
  'application.backgroundURL',
  '/images/truck-background.jpg'
)
configFallbackValues.set('application.bigLogoURL', '/images/monty-big.svg')
configFallbackValues.set('application.smallLogoURL', '/images/monty-small.svg')
configFallbackValues.set('application.httpPort', 7000)
configFallbackValues.set('application.maximumProcesses', 4)
configFallbackValues.set('application.allowTesting', false)

configFallbackValues.set('tempUsers', [])

configFallbackValues.set('reverseProxy.disableCompression', false)
configFallbackValues.set('reverseProxy.disableEtag', false)
configFallbackValues.set('reverseProxy.urlPrefix', '')

configFallbackValues.set('session.cookieName', 'monty-user-sid')
configFallbackValues.set('session.secret', 'cityssm/monty')
configFallbackValues.set(property_session_maxAgeMillis, 60 * 60 * 1000)
configFallbackValues.set('session.doKeepAlive', false)

configFallbackValues.set('features.attendance.absences', true)
configFallbackValues.set('features.attendance.callOuts', true)
configFallbackValues.set('features.attendance.returnsToWork', true)
configFallbackValues.set('features.attendance.afterHours', true)

configFallbackValues.set('features.employees.avantiSync', false)
configFallbackValues.set('features.selfService', false)

configFallbackValues.set('settings.avantiSync.locationCodes', [])

configFallbackValues.set('settings.employeeEligibilityFunctions', [])
configFallbackValues.set('settings.employeeSortKeyFunctions', [])

configFallbackValues.set('settings.printPdf.contentDisposition', 'attachment')

configFallbackValues.set('settings.recentDays', 10)
configFallbackValues.set('settings.updateDays', 5)

configFallbackValues.set('settings.selfService.path', '/selfService')

/*
 * Set up function overloads
 */

export function getConfigProperty(
  propertyName:
    | 'application.applicationName'
    | 'application.backgroundURL'
    | 'application.bigLogoURL'
    | 'application.smallLogoURL'
    | 'application.userDomain'
    | 'reverseProxy.urlPrefix'
    | 'session.cookieName'
    | 'session.secret'
): string

export function getConfigProperty(
  propertyName:
    | 'application.httpPort'
    | 'application.maximumProcesses'
    | 'session.maxAgeMillis'
    | 'settings.recentDays'
    | 'settings.updateDays'
): number

export function getConfigProperty(
  propertyName:
    | 'application.allowTesting'
    | 'reverseProxy.disableCompression'
    | 'reverseProxy.disableEtag'
    | 'session.doKeepAlive'
    | 'features.attendance.absences'
    | 'features.attendance.callOuts'
    | 'features.attendance.returnsToWork'
    | 'features.attendance.afterHours'
    | 'features.employees.avantiSync'
    | 'features.selfService'
): boolean

export function getConfigProperty(
  propertyName: 'tempUsers'
): ConfigTemporaryUserCredentials[]

export function getConfigProperty(
  propertyName: 'activeDirectory'
): ConfigActiveDirectory | undefined

export function getConfigProperty(
  propertyName: 'adWebAuthConfig'
): ADWebAuthConfig | undefined

export function getConfigProperty(propertyName: 'mssql'): MSSQLConfig

export function getConfigProperty(
  propertyName: 'settings.avantiSync.config'
): AvantiConfig
export function getConfigProperty(
  propertyName: 'settings.avantiSync.locationCodes'
): string[]

export function getConfigProperty(
  propertyName: 'settings.printPdf.contentDisposition'
): 'attachment' | 'inline'

export function getConfigProperty(
  propertyName: 'settings.employeeEligibilityFunctions'
): ConfigEmployeeEligibilityFunction[]

export function getConfigProperty(
  propertyName: 'settings.employeeSortKeyFunctions'
): ConfigEmployeeSortKeyFunction[]

export function getConfigProperty(
  propertyName: 'settings.employeeNumberRegularExpression'
): RegExp | undefined

export function getConfigProperty(
  propertyName: 'settings.selfService.path'
): `/${string}`

export function getConfigProperty(propertyName: string): unknown {
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

export function includeAttendance(): boolean {
  return (
    getConfigProperty('features.attendance.absences') ||
    getConfigProperty('features.attendance.callOuts') ||
    getConfigProperty('features.attendance.returnsToWork')
  )
}

export const historicalDays = getConfigProperty('settings.recentDays') * 3
export const deleteDays = historicalDays * 3

export const keepAliveMillis = getConfigProperty('session.doKeepAlive')
  ? Math.max(
      getConfigProperty(property_session_maxAgeMillis) / 2,
      getConfigProperty(property_session_maxAgeMillis) - 10 * 60 * 1000
    )
  : 0

export default {
  getConfigProperty,
  includeAttendance,
  historicalDays,
  deleteDays,
  keepAliveMillis
}
