import * as assert from 'node:assert'

import * as userFunctions from '../helpers/functions.user.js'
import * as polyfills from '../helpers/polyfills.js'

describe('functions.user', () => {
  describe('unauthenticated, no user in session', () => {
    const noUserRequest = {
      session: {}
    }

    it('is not admin', () => {
      assert.strictEqual(userFunctions.userIsAdmin(noUserRequest), false)
    })
  })

  describe('user, no admin', () => {
    const readOnlyRequest: userFunctions.UserRequest = {
      session: {
        user: {
          userName: '*test',
          canLogin: true,
          isAdmin: false
        }
      }
    }

    it('is not admin', () => {
      assert.strictEqual(userFunctions.userIsAdmin(readOnlyRequest), false)
    })
  })

  describe('admin user', () => {
    const adminOnlyRequest: userFunctions.UserRequest = {
      session: {
        user: {
          userName: '*test',
          canLogin: true,
          isAdmin: true
        }
      }
    }

    it('is admin', () => {
      assert.strictEqual(userFunctions.userIsAdmin(adminOnlyRequest), true)
    })
  })
})

describe('polyfills', () => {
  it('applys Object.hasOwn polyfill', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (Object as any).hasOwn
    assert.ok(Object.hasOwn === undefined)

    polyfills.applyPolyfills()
    assert.ok(Object.hasOwn !== undefined)

    const testObject = { foo: 'bar' }
    assert.ok(Object.hasOwn(testObject, 'foo'))
  })
})
