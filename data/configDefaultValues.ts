import type { ADWebAuthConfig } from '@cityssm/ad-web-auth-connector'
import type { types as AvantiApiTypes } from '@cityssm/avanti-api'
import type { config as MSSQLConfig } from 'mssql'

import type {
  ConfigActiveDirectory,
  ConfigEmployeeEligibilityFunction,
  ConfigEmployeeSortKeyFunction,
  ConfigTemporaryUserCredentials
} from '../types/configTypes.js'

export const configDefaultValues = {
  'application.applicationName': 'Attendance Tracking',
  'application.userDomain': '',
  'application.backgroundURL': '/images/truck-background.jpg',
  'application.bigLogoURL': '/images/app-big.svg',
  'application.smallLogoURL': '/images/app-small.svg',
  'application.httpPort': 7000,
  'application.maximumProcesses': 4,
  'application.allowTesting': false,

  tempUsers: [] as ConfigTemporaryUserCredentials[],

  'reverseProxy.disableCompression': false,
  'reverseProxy.disableEtag': false,
  'reverseProxy.urlPrefix': '',

  'session.cookieName': 'attendance-tracking-user-sid',
  'session.secret': 'cityssm/attendance-tracking',
  'session.maxAgeMillis': 60 * 60 * 1000,
  'session.doKeepAlive': false,

  activeDirectory: undefined as ConfigActiveDirectory | undefined,
  adWebAuthConfig: undefined as ADWebAuthConfig | undefined,

  mssql: undefined as unknown as MSSQLConfig,

  'features.attendance.absences': true,
  'features.attendance.callOuts': true,
  'features.attendance.returnsToWork': true,
  'features.attendance.afterHours': true,
  'features.employees.avantiSync': false,
  'features.selfService': false,
  'features.help': true,

  'settings.avantiSync.config': undefined as
    | AvantiApiTypes.AvantiApiConfiguration
    | undefined,
  'settings.avantiSync.locationCodes': [] as string[],

  'settings.employeeNumberRegularExpression': undefined as RegExp | undefined,

  'settings.employeeEligibilityFunctions':
    [] as ConfigEmployeeEligibilityFunction[],
  'settings.employeeSortKeyFunctions': [] as ConfigEmployeeSortKeyFunction[],

  'settings.printPdf.contentDisposition': 'attachment' as
    | 'attachment'
    | 'inline',

  'settings.recentDays': 10,
  'settings.updateDays': 5,

  'settings.selfService.path': '/selfService' as `/${string}`
}
