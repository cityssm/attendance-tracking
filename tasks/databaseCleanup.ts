import Debug from 'debug'
import exitHook from 'exit-hook'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async'

import { moveRecordsToHistorical } from '../database/moveRecordsToHistorical.js'
import { purgeDeletedRecords } from '../database/purgeDeletedRecords.js'

const debug = Debug('monty:task:databaseCleanup')

async function doCleanup(): Promise<void> {
  const archivedRecordsCount = await moveRecordsToHistorical()
  debug(archivedRecordsCount.toString() + ' records archived.')

  const deletedRecordsCount = await purgeDeletedRecords()
  debug(deletedRecordsCount.toString() + ' records permanently deleted.')
}

await doCleanup().catch(() => {
  // ignore
})

const intervalID = setIntervalAsync(doCleanup, 3 * 86_400 * 1000)

exitHook(() => {
  try {
    void clearIntervalAsync(intervalID)
  } catch {
    // ignore
  }
})
