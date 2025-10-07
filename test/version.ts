import assert from 'node:assert'
import fs from 'node:fs'
import { describe, it } from 'node:test'

import { version } from '../version.js'

await describe('version.js', async () => {
  await it('Has a version that matches the package.json', () => {
    const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    assert.strictEqual(version, packageJSON.version)
  })
})
