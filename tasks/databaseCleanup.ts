
import exitHook from 'exit-hook'
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async'

import { doDatabaseCleanup } from './functions/doDatabaseCleanup'

await doDatabaseCleanup().catch(() => {
  // ignore
})

const intervalID = setIntervalAsync(doDatabaseCleanup, 3 * 86_400 * 1000)

exitHook(() => {
  try {
    void clearIntervalAsync(intervalID)
  } catch {
    // ignore
  }
})
