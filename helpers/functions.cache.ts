import cluster from 'node:cluster'

import Debug from 'debug'

import { getEmployeePropertyNames as getEmployeePropertyNamesFromDatabase } from '../database/getEmployeePropertyNames.js'
import type {
  ClearCacheWorkerMessage,
  CacheTableName
} from '../types/applicationTypes.js'
import type * as recordTypes from '../types/recordTypes.js'

const debug = Debug(`monty:functions.cache:${process.pid}`)

let employeeProperties: string[] | undefined

export async function getEmployeePropertyNames(): Promise<string[]> {
  if (employeeProperties === undefined) {
    debug('Cache miss: EmployeeProperties')
    employeeProperties = await getEmployeePropertyNamesFromDatabase()
  }

  return employeeProperties
}

export function clearCacheByTableName(
  tableName: CacheTableName,
  relayMessage = true
): void {
  switch (tableName) {
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

process.on('message', (message: ClearCacheWorkerMessage) => {
  if (message.messageType === 'clearCache' && message.pid !== process.pid) {
    debug(`Clearing cache: ${message.tableName}`)
    clearCacheByTableName(message.tableName, false)
  }
})
