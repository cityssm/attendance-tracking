import Debug from 'debug'
import exitHook from 'exit-hook'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async'

import { moveRecordsToHistorical } from '../database/moveRecordsToHistorical.js'

const debug = Debug('monty:task:databaseCleanup')

async function doCleanup(): Promise<void> {
  const archivedRecordsCount = await moveRecordsToHistorical()

  debug(archivedRecordsCount.toString() + ' records archived.')
}

await doCleanup().catch(() => {
  // ignore
})

const intervalID = setIntervalAsync(doCleanup, 2 * 86_400 * 1000)

exitHook(() => {
  try {
    void clearIntervalAsync(intervalID)
  } catch {
    // ignore
  }
})
