/* eslint-disable unicorn/filename-case */

import * as assert from 'node:assert'

import { doDatabaseCleanup } from '../tasks/functions/doDatabaseCleanup.js'

describe('tasks/databaseCleanup.js', () => {
  it('Runs task successfully', async () => {
    await doDatabaseCleanup()
    assert.ok(true)
  })
})
