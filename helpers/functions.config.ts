/* eslint-disable @typescript-eslint/indent, node/no-unpublished-import */

import './polyfills.js'

import { config } from '../data/config.js'

import type * as configTypes from '../types/configTypes'

// eslint-disable-next-line node/no-extraneous-import
import type { config as MSSQLConfig } from 'mssql'

import type { Configuration as AvantiConfig } from '@cityssm/avanti-api'

import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector/types'

/*
 * SET UP FALLBACK VALUES
 */

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
configFallbackValues.set('application.tempAdminPassword', '')

configFallbackValues.set('reverseProxy.disableCompression', false)
configFallbackValues.set('reverseProxy.disableEtag', false)
configFallbackValues.set('reverseProxy.urlPrefix', '')

configFallbackValues.set('session.cookieName', 'monty-user-sid')
configFallbackValues.set('session.secret', 'cityssm/monty')
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000)
configFallbackValues.set('session.doKeepAlive', false)

configFallbackValues.set('features.attendance.absences', true)
configFallbackValues.set('features.attendance.callOuts', true)
configFallbackValues.set('features.attendance.returnsToWork', true)
configFallbackValues.set('features.attendance.afterHours', true)

configFallbackValues.set('features.employees.avantiSync', false)

configFallbackValues.set('settings.avantiSync.locationCodes', [])

configFallbackValues.set('settings.employeeEligibilityFunctions', [])
configFallbackValues.set('settings.employeeSortKeyFunctions', [])

configFallbackValues.set('settings.printPdf.contentDisposition', 'attachment')

configFallbackValues.set('settings.recentDays', 10)

/*
 * Set up function overloads
 */

export function getProperty(propertyName: 'application.applicationName'): string

export function getProperty(propertyName: 'application.backgroundURL'): string
export function getProperty(propertyName: 'application.bigLogoURL'): string
export function getProperty(propertyName: 'application.smallLogoURL'): string

export function getProperty(propertyName: 'application.httpPort'): number
export function getProperty(propertyName: 'application.userDomain'): string
export function getProperty(propertyName: 'application.tempAdminPassword'): string

export function getProperty(
  propertyName: 'activeDirectory'
): configTypes.ConfigActiveDirectory | undefined

export function getProperty(
  propertyName: 'adWebAuthConfig'
): ADWebAuthConfig | undefined

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
  propertyName: 'features.attendance.absences'
): boolean
export function getProperty(
  propertyName: 'features.attendance.callOuts'
): boolean
export function getProperty(
  propertyName: 'features.attendance.returnsToWork'
): boolean
export function getProperty(
  propertyName: 'features.attendance.afterHours'
): boolean

export function getProperty(
  propertyName: 'features.employees.avantiSync'
): boolean

export function getProperty(propertyName: 'mssql'): MSSQLConfig

export function getProperty(
  propertyName: 'settings.avantiSync.config'
): AvantiConfig
export function getProperty(
  propertyName: 'settings.avantiSync.locationCodes'
): string[]

export function getProperty(
  propertyName: 'settings.printPdf.contentDisposition'
): 'attachment' | 'inline'

export function getProperty(
  propertyName: 'settings.employeeEligibilityFunctions'
): configTypes.ConfigEmployeeEligibilityFunction[]

export function getProperty(
  propertyName: 'settings.employeeSortKeyFunctions'
): configTypes.ConfigEmployeeSortKeyFunction[]

export function getProperty(propertyName: 'settings.recentDays'): number

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

export function includeAttendance(): boolean {
  return (
    getProperty('features.attendance.absences') ||
    getProperty('features.attendance.callOuts') ||
    getProperty('features.attendance.returnsToWork')
  )
}

export const keepAliveMillis = getProperty('session.doKeepAlive')
  ? Math.max(
      getProperty('session.maxAgeMillis') / 2,
      getProperty('session.maxAgeMillis') - 10 * 60 * 1000
    )
  : 0
