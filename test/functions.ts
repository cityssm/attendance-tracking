import * as assert from 'node:assert'

// eslint-disable-next-line node/no-unpublished-import
import { v4 } from 'uuid'

import * as selfServiceFunctions from '../helpers/functions.selfService.js'
import * as userFunctions from '../helpers/functions.user.js'

import { getSelfServiceUser, type TestSelfServiceUser } from './_globals.js'

describe('functions.selfService', () => {
  let testSelfService: TestSelfServiceUser

  before(async () => {
    testSelfService = await getSelfServiceUser()
  })

  it('validates employee', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(validation.success)
  })

  it('blocks employee with invalid employee number', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: v4(),
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with invalid four digits', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.invalid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing employee number', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: '',
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing four digits', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits: ''
      }
    })

    assert.ok(!validation.success)
  })
})

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
