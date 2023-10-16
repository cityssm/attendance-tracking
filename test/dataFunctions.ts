import assert from 'node:assert'

import {
  eligibility_hasProperty,
  sortKey_alphabetical,
  sortKey_propertyValue
} from '../data/functions.js'
import type { Employee } from '../types/recordTypes.js'

const employeeWithProperties: Employee = {
  employeeNumber: '12345',
  employeeGivenName: 'Joe',
  employeeSurname: 'Tester',
  userName: '',
  workContact1: '',
  workContact2: '',
  homeContact1: '',
  homeContact2: '',
  syncContacts: false,
  jobTitle: '',
  department: '',
  isSynced: false,
  isActive: true,
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
        eligibility_hasProperty.eligibilityFunction(
          employeeWithProperties,
          'testProperty'
        )
      )
    })

    it('Returns false when property is not found', () => {
      assert.ok(
        !eligibility_hasProperty.eligibilityFunction(
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
      employeeSurname: 'Aikens',
      userName: '',
      workContact1: '',
      workContact2: '',
      homeContact1: '',
      homeContact2: '',
      syncContacts: false,
      jobTitle: '',
      department: '',
      isSynced: false,
      isActive: true
    }

    const employeeB: Employee = {
      employeeNumber: '1',
      employeeGivenName: 'Bertrum',
      employeeSurname: 'Bringleson',
      userName: '',
      workContact1: '',
      workContact2: '',
      homeContact1: '',
      homeContact2: '',
      syncContacts: false,
      jobTitle: '',
      department: '',
      isSynced: false,
      isActive: true
    }

    it('Sorts employees alphabetically', () => {
      const sortKeyA = sortKey_alphabetical.sortKeyFunction(employeeA)
      const sortKeyB = sortKey_alphabetical.sortKeyFunction(employeeB)

      assert.ok(sortKeyA < sortKeyB)
    })
  })

  describe('sortKey_propertyValue()', () => {
    it('Returns value when property is found', () => {
      assert.strictEqual(
        sortKey_propertyValue.sortKeyFunction(
          employeeWithProperties,
          'testProperty'
        ),
        'testValue'
      )
    })

    it('Returns "" when property is not found', () => {
      assert.strictEqual(
        sortKey_propertyValue.sortKeyFunction(
          employeeWithProperties,
          'missingProperty'
        ),
        ''
      )
    })
  })
})
