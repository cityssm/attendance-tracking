import * as assert from 'node:assert'

import * as userFunctions from '../helpers/functions.user.js'

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
