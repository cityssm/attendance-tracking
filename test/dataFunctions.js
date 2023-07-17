import * as assert from 'node:assert';
import * as dataFunctions from '../data/functions.js';
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
describe('data/functions.js', () => {
    describe('eligibility_hasProperty()', () => {
        it('Returns true when property is found', () => {
            assert.ok(dataFunctions.eligibility_hasProperty.eligibilityFunction(employeeWithProperties, 'testProperty'));
        });
        it('Returns false when property is not found', () => {
            assert.ok(!dataFunctions.eligibility_hasProperty.eligibilityFunction(employeeWithProperties, 'missingProperty'));
        });
    });
    describe('sortKey_alphabetical()', () => {
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
        it('Sorts employees alphabetically', () => {
            const sortKeyA = dataFunctions.sortKey_alphabetical.sortKeyFunction(employeeA);
            const sortKeyB = dataFunctions.sortKey_alphabetical.sortKeyFunction(employeeB);
            assert.ok(sortKeyA < sortKeyB);
        });
    });
    describe('sortKey_propertyValue()', () => {
        it('Returns value when property is found', () => {
            assert.strictEqual(dataFunctions.sortKey_propertyValue.sortKeyFunction(employeeWithProperties, 'testProperty'), 'testValue');
        });
        it('Returns "" when property is not found', () => {
            assert.strictEqual(dataFunctions.sortKey_propertyValue.sortKeyFunction(employeeWithProperties, 'missingProperty'), '');
        });
    });
});
