import assert from 'node:assert';
import { describe, it } from 'node:test';
import { eligibility_hasProperty, sortKey_alphabetical, sortKey_propertyValue } from '../data/functions.js';
const employeeWithProperties = {
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
};
await describe('data/functions.js', async () => {
    await describe('eligibility_hasProperty()', async () => {
        await it('Returns true when property is found', () => {
            assert.ok(eligibility_hasProperty.eligibilityFunction(employeeWithProperties, 'testProperty'));
        });
        await it('Returns false when property is not found', () => {
            assert.ok(!eligibility_hasProperty.eligibilityFunction(employeeWithProperties, 'missingProperty'));
        });
    });
    await describe('sortKey_alphabetical()', async () => {
        const employeeA = {
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
        };
        const employeeB = {
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
        };
        await it('Sorts employees alphabetically', () => {
            const sortKeyA = sortKey_alphabetical.sortKeyFunction(employeeA);
            const sortKeyB = sortKey_alphabetical.sortKeyFunction(employeeB);
            assert.ok(sortKeyA < sortKeyB);
        });
    });
    await describe('sortKey_propertyValue()', async () => {
        await it('Returns value when property is found', () => {
            assert.strictEqual(sortKey_propertyValue.sortKeyFunction(employeeWithProperties, 'testProperty'), 'testValue');
        });
        await it('Returns "" when property is not found', () => {
            assert.strictEqual(sortKey_propertyValue.sortKeyFunction(employeeWithProperties, 'missingProperty'), '');
        });
    });
});
