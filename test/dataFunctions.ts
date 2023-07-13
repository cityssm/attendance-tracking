import * as assert from 'node:assert'

import * as dataFunctions from '../data/functions.js'
import type { Employee } from '../types/recordTypes.js'

const employeeWithProperties: Employee = {
  employeeNumber: '12345',
  employeeGivenName: 'Joe',
  employeeSurname: 'Tester',
  employeeProperties: [
    {
      propertyName: 'testProperty',
      propertyValue: 'testValue'
    }
  ]
}

describe('data/functions.js', () => {
  describe('eligibility_hasProperty()', () => {
    it('Returns true when property is found', () => {
      assert.ok(
        dataFunctions.eligibility_hasProperty.eligibilityFunction(
          employeeWithProperties,
          'testProperty'
        )
      )
    })

    it('Returns false when property is not found', () => {
      assert.ok(
        !dataFunctions.eligibility_hasProperty.eligibilityFunction(
          employeeWithProperties,
          'missingProperty'
        )
      )
    })
  })

  describe('sortKey_alphabetical()', () => {
    const employeeA: Employee = {
      employeeNumber: '2',
      employeeGivenName: 'Amanda',
      employeeSurname: 'Aikens'
    }

    const employeeB: Employee = {
      employeeNumber: '1',
      employeeGivenName: 'Bertrum',
      employeeSurname: 'Bringleson'
    }

    it('Sorts employees alphabetically', () => {
      const sortKeyA =
        dataFunctions.sortKey_alphabetical.sortKeyFunction(employeeA)
      const sortKeyB =
        dataFunctions.sortKey_alphabetical.sortKeyFunction(employeeB)

      assert.ok(sortKeyA < sortKeyB)
    })
  })

  describe('sortKey_propertyValue()', () => {
    it('Returns value when property is found', () => {
      assert.strictEqual(
        dataFunctions.sortKey_propertyValue.sortKeyFunction(
          employeeWithProperties,
          'testProperty'
        ),
        'testValue'
      )
    })

    it('Returns "" when property is not found', () => {
      assert.strictEqual(
        dataFunctions.sortKey_propertyValue.sortKeyFunction(
          employeeWithProperties,
          'missingProperty'
        ),
        ''
      )
    })
  })
})
