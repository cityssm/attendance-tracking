// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import cluster from 'node:cluster'

import Debug from 'debug'

import { getAbsenceTypes as getAbsenceTypesFromDatabase } from '../database/getAbsenceTypes.js'
import { getAfterHoursReasons as getAfterHoursReasonsFromDatabase } from '../database/getAfterHoursReasons.js'
import { getCallOutResponseTypes as getCallOutResponseTypesFromDatabase } from '../database/getCallOutResponseTypes.js'
import { getEmployeePropertyNames as getEmployeePropertyNamesFromDatabase } from '../database/getEmployeePropertyNames.js'
import type {
  ClearCacheWorkerMessage,
  CacheTableName
} from '../types/applicationTypes.js'
import type {
  AbsenceType,
  AfterHoursReason,
  CallOutResponseType
} from '../types/recordTypes.js'

const debug = Debug(`attendance-tracking:functions.cache:${process.pid}`)

/*
 * Absence Types
 */

let absenceTypes: AbsenceType[] = []

export async function getAbsenceTypes(): Promise<AbsenceType[]> {
  if (absenceTypes.length === 0) {
    debug('Cache miss: AbsenceTypes')
    absenceTypes = await getAbsenceTypesFromDatabase()
  }

  return absenceTypes
}

/*
 * After Hours Reasons
 */

let afterHoursReasons: AfterHoursReason[] = []

export async function getAfterHoursReasons(): Promise<AfterHoursReason[]> {
  if (afterHoursReasons.length === 0) {
    debug('Cache miss: AfterHoursReasons')
    afterHoursReasons = await getAfterHoursReasonsFromDatabase()
  }

  return afterHoursReasons
}

/*
 * Call Out Response Types
 */

let callOutResponseTypes: CallOutResponseType[] = []

export async function getCallOutResponseTypes(): Promise<
  CallOutResponseType[]
> {
  if (callOutResponseTypes.length === 0) {
    debug('Cache miss: CallOutResponseTypes')
    callOutResponseTypes = await getCallOutResponseTypesFromDatabase()
  }

  return callOutResponseTypes
}

/*
 * Employee Property Names
 */

let employeeProperties: string[] = []

export async function getEmployeePropertyNames(): Promise<string[]> {
  if (employeeProperties.length === 0) {
    debug('Cache miss: EmployeeProperties')
    employeeProperties = await getEmployeePropertyNamesFromDatabase()
  }

  return employeeProperties
}

/*
 * Clear Caches
 */

export function clearCacheByTableName(
  tableName: CacheTableName,
  relayMessage = true
): void {
  switch (tableName) {
    case 'AbsenceTypes': {
      absenceTypes = []
      break
    }
    case 'AfterHoursReasons': {
      afterHoursReasons = []
      break
    }
    case 'CallOutResponseTypes': {
      callOutResponseTypes = []
      break
    }
    case 'EmployeeProperties': {
      employeeProperties = []
      break
    }
    default: {
      debug(`Unknown table name: ${tableName as string}`)
      break
    }
  }

  try {
    if (relayMessage && cluster.isWorker && process.send !== undefined) {
      const workerMessage: ClearCacheWorkerMessage = {
        messageType: 'clearCache',
        tableName,
        timeMillis: Date.now(),
        pid: process.pid
      }

      debug(`Sending clear cache from worker: ${tableName}`)

      process.send(workerMessage)
    }
  } catch {
    debug('Error sending clear cache message.')
  }
}

/*
 * Respond to messaging
 */

process.on('message', (message: ClearCacheWorkerMessage) => {
  if (message.messageType === 'clearCache' && message.pid !== process.pid) {
    debug(`Clearing cache: ${message.tableName}`)
    clearCacheByTableName(message.tableName, false)
  }
})
