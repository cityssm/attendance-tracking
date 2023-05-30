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
import type * as recordTypes from '../types/recordTypes'

const debug = Debug(`monty:functions.cache:${process.pid}`)

/*
 * Absence Types
 */

let absenceTypes: recordTypes.AbsenceType[] | undefined

export async function getAbsenceTypes(): Promise<recordTypes.AbsenceType[]> {
  if (absenceTypes === undefined) {
    debug('Cache miss: AbsenceTypes')
    absenceTypes = await getAbsenceTypesFromDatabase()
  }

  return absenceTypes
}

/*
 * After Hours Reasons
 */

let afterHoursReasons: recordTypes.AfterHoursReason[] | undefined

export async function getAfterHoursReasons(): Promise<
  recordTypes.AfterHoursReason[]
> {
  if (afterHoursReasons === undefined) {
    debug('Cache miss: AfterHoursReasons')
    afterHoursReasons = await getAfterHoursReasonsFromDatabase()
  }

  return afterHoursReasons
}

/*
 * Call Out Response Types
 */

let callOutResponseTypes: recordTypes.CallOutResponseType[] | undefined

export async function getCallOutResponseTypes(): Promise<
  recordTypes.CallOutResponseType[]
> {
  if (callOutResponseTypes === undefined) {
    debug('Cache miss: CallOutResponseTypes')
    callOutResponseTypes = await getCallOutResponseTypesFromDatabase()
  }

  return callOutResponseTypes
}

/*
 * Employee Property Names
 */

let employeeProperties: string[] | undefined

export async function getEmployeePropertyNames(): Promise<string[]> {
  if (employeeProperties === undefined) {
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
      absenceTypes = undefined
      break
    }
    case 'AfterHoursReasons': {
      afterHoursReasons = undefined
      break
    }
    case 'CallOutResponseTypes': {
      callOutResponseTypes = undefined
      break
    }
    case 'EmployeeProperties': {
      employeeProperties = undefined
      break
    }
  }

  try {
    if (relayMessage && cluster.isWorker) {
      const workerMessage: ClearCacheWorkerMessage = {
        messageType: 'clearCache',
        tableName,
        timeMillis: Date.now(),
        pid: process.pid
      }

      debug(`Sending clear cache from worker: ${tableName}`)

      process.send!(workerMessage)
    }
  } catch {}
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
