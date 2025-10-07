import assert from 'node:assert';
import { describe, it } from 'node:test';
import { doDatabaseCleanup } from '../tasks/functions/doDatabaseCleanup.js';
await describe('tasks/databaseCleanup.js', async () => {
    await it('Runs task successfully', async () => {
        await doDatabaseCleanup();
        assert.ok(true);
    });
});
