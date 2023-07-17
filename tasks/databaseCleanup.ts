import Debug from 'debug'
import exitHook from 'exit-hook'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async'

import { doDatabaseCleanup } from './functions/doDatabaseCleanup.js'

const debug = Debug('monty:tasks:databaseCleanup')

await doDatabaseCleanup().catch(() => {
  debug('Error running task.')
})

const intervalID = setIntervalAsync(doDatabaseCleanup, 3 * 86_400 * 1000)

exitHook(() => {
  try {
    void clearIntervalAsync(intervalID)
  } catch {
    debug('Error exiting task.')
  }
})
