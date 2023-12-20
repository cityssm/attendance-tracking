// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

// eslint-disable-next-line n/no-missing-import
import { Configurator } from '@cityssm/configurator'

import { config } from '../data/config.js'
import { configDefaultValues } from '../data/configDefaultValues.js'

// eslint-disable-next-line @typescript-eslint/naming-convention
const property_session_maxAgeMillis = 'session.maxAgeMillis'

const configurator = new Configurator(
  configDefaultValues,
  config as unknown as Record<string, unknown>
)

export function getConfigProperty<K extends keyof typeof configDefaultValues>(
  propertyName: K,
  fallbackValue?: (typeof configDefaultValues)[K]
): (typeof configDefaultValues)[K] {
  return configurator.getConfigProperty(
    propertyName,
    fallbackValue
  ) as (typeof configDefaultValues)[K]
}

export const isLogoOverwritten =
  configurator.isDefaultValueOverwritten('application.bigLogoURL') ||
  configurator.isDefaultValueOverwritten('application.smallLogoURL')

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
  isLogoOverwritten,
  historicalDays,
  deleteDays,
  keepAliveMillis
}
