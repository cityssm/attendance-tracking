import exitHook from 'exit-hook';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';
import { doDatabaseCleanup } from './functions/doDatabaseCleanup.js';
await doDatabaseCleanup().catch(() => {
});
const intervalID = setIntervalAsync(doDatabaseCleanup, 3 * 86400 * 1000);
exitHook(() => {
    try {
        void clearIntervalAsync(intervalID);
    }
    catch {
    }
});
