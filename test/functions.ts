import * as assert from 'node:assert'

// eslint-disable-next-line node/no-unpublished-import
import { v4 } from 'uuid'

import { getEmployees } from '../database/getEmployees.js'
import * as selfServiceFunctions from '../helpers/functions.selfService.js'
import * as userFunctions from '../helpers/functions.user.js'

describe('functions.selfService', () => {
  let employeeNumber = ''
  let validFourDigits = ''
  let invalidFourDigits = ''

  before(async () => {
    const employees = await getEmployees(
      {
        isActive: true
      },
      {
        includeProperties: false
      }
    )

    for (const employee of employees) {
      employeeNumber = employee.employeeNumber

      const possibleFourDigits1 = (employee.homeContact1 ?? '').slice(-4)
      const possibleFourDigits2 = (employee.homeContact2 ?? '').slice(-4)

      if (/\d{4}/.test(possibleFourDigits1)) {
        validFourDigits = possibleFourDigits1
      } else if (/\d{4}/.test(possibleFourDigits2)) {
        validFourDigits = possibleFourDigits2
      } else {
        continue
      }

      let counter = 1000

      while (
        invalidFourDigits === '' ||
        invalidFourDigits === validFourDigits
      ) {
        invalidFourDigits = counter.toString()
        counter += 1
      }

      break
    }
  })

  it('validates employee', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber,
        employeeHomeContactLastFourDigits: validFourDigits
      }
    })

    assert.ok(validation.success)
  })

  it('blocks employee with invalid employee number', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: v4(),
        employeeHomeContactLastFourDigits: validFourDigits
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with invalid four digits', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber,
        employeeHomeContactLastFourDigits: invalidFourDigits
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing employee number', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber: '',
        employeeHomeContactLastFourDigits: validFourDigits
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing four digits', async () => {
    const validation = await selfServiceFunctions.validateEmployeeFields({
      body: {
        employeeNumber,
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
