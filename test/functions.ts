import * as assert from 'node:assert'

// eslint-disable-next-line node/no-unpublished-import
import { v4 } from 'uuid'

import { getEmployees } from '../database/getEmployees.js'
import * as selfServiceFunctions from '../helpers/functions.selfService.js'
import * as userFunctions from '../helpers/functions.user.js'

interface TestSelfServiceUser {
  employeeNumber: string
  employeeHomeContactLastFourDigits: { valid: string; invalid: string }
}

async function getSelfServiceUser(): Promise<TestSelfServiceUser> {
  let employeeNumber = ''
  let employeeHomeContactLastFourDigitsValid = ''
  let employeeHomeContactLastFourDigitsInvalid = ''

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
      employeeHomeContactLastFourDigitsValid = possibleFourDigits1
    } else if (/\d{4}/.test(possibleFourDigits2)) {
      employeeHomeContactLastFourDigitsValid = possibleFourDigits2
    } else {
      continue
    }

    let counter = 1000

    while (
      employeeHomeContactLastFourDigitsInvalid === '' ||
      employeeHomeContactLastFourDigitsInvalid ===
        employeeHomeContactLastFourDigitsValid
    ) {
      employeeHomeContactLastFourDigitsInvalid = counter.toString()
      counter += 1
    }

    break
  }

  return {
    employeeNumber,
    employeeHomeContactLastFourDigits: {
      valid: employeeHomeContactLastFourDigitsValid,
      invalid: employeeHomeContactLastFourDigitsInvalid
    }
  }
}

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
