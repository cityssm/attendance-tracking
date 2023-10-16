import assert from 'node:assert'

import type { Request } from 'express'
import { v4 } from 'uuid'

import { getEmployees } from '../database/getEmployees.js'
import { validateEmployeeFields } from '../helpers/functions.selfService.js'
import { userIsAdmin } from '../helpers/functions.user.js'

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

describe('helpers/functions.selfService.js', () => {
  let testSelfService: TestSelfServiceUser

  before(async () => {
    testSelfService = await getSelfServiceUser()
  })

  it('validates employee', async () => {
    const validation = await validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(validation.success)
  })

  it('blocks employee with invalid employee number', async () => {
    const validation = await validateEmployeeFields({
      body: {
        employeeNumber: v4(),
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with invalid four digits', async () => {
    const validation = await validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.invalid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing employee number', async () => {
    const validation = await validateEmployeeFields({
      body: {
        employeeNumber: '',
        employeeHomeContactLastFourDigits:
          testSelfService.employeeHomeContactLastFourDigits.valid
      }
    })

    assert.ok(!validation.success)
  })

  it('blocks employee with missing four digits', async () => {
    const validation = await validateEmployeeFields({
      body: {
        employeeNumber: testSelfService.employeeNumber,
        employeeHomeContactLastFourDigits: ''
      }
    })

    assert.ok(!validation.success)
  })
})

describe('helpers/functions.user.js', () => {
  describe('unauthenticated, no user in session', () => {
    const noUserRequest = {
      session: {}
    }

    it('is not admin', () => {
      assert.strictEqual(userIsAdmin(noUserRequest as Request), false)
    })
  })

  describe('user, no admin', () => {
    const readOnlyRequest = {
      session: {
        user: {
          userName: '*test',
          canLogin: true,
          isAdmin: false
        }
      }
    }

    it('is not admin', () => {
      assert.strictEqual(userIsAdmin(readOnlyRequest as Request), false)
    })
  })

  describe('admin user', () => {
    const adminOnlyRequest = {
      session: {
        user: {
          userName: '*test',
          canLogin: true,
          isAdmin: true
        }
      }
    }

    it('is admin', () => {
      assert.strictEqual(userIsAdmin(adminOnlyRequest as Request), true)
    })
  })
})
