import * as assert from 'node:assert';
import { createEmployee } from '../database/createEmployee.js';
import { deleteEmployee } from '../database/deleteEmployee.js';
import { deleteEmployeeProperty } from '../database/deleteEmployeeProperty.js';
import { getEmployee } from '../database/getEmployee.js';
import { getEmployeePropertyNames } from '../database/getEmployeePropertyNames.js';
import { getEmployeePropertyValue } from '../database/getEmployeePropertyValue.js';
import { getEmployees } from '../database/getEmployees.js';
import { setEmployeeProperty } from '../database/setEmployeeProperty.js';
import { testAdmin } from './_globals.js';
describe('database/employeeProperties', () => {
    let employee;
    let purgeEmployee = false;
    const propertyName = 'testProperty.' + Date.now().toString();
    const propertyValue = 'test value';
    const updatedPropertyValue = 'updated value';
    let user;
    before(async () => {
        user = {
            userName: testAdmin?.user.userName ?? 'testUser',
            canLogin: true,
            isAdmin: true
        };
        const employees = await getEmployees({
            isActive: true
        }, {});
        if (employees.length === 0) {
            purgeEmployee = true;
            const employeeNumber = 'testing123';
            const success = await createEmployee({
                employeeNumber,
                employeeGivenName: 'Susan',
                employeeSurname: 'Tester'
            }, user);
            if (success) {
                employee = (await getEmployee(employeeNumber));
            }
        }
        else {
            employee = employees[0];
        }
    });
    after(async () => {
        if (purgeEmployee) {
            await deleteEmployee(employee.employeeNumber, user);
        }
    });
    it('Sets a new property', async () => {
        const success = await setEmployeeProperty({
            employeeNumber: employee.employeeNumber,
            propertyName,
            propertyValue
        }, false, user);
        assert.ok(success);
        const savedValue = await getEmployeePropertyValue(employee.employeeNumber, propertyName);
        assert.strictEqual(propertyValue, savedValue);
    });
    it('Updates the property', async () => {
        const success = await setEmployeeProperty({
            employeeNumber: employee.employeeNumber,
            propertyName,
            propertyValue: updatedPropertyValue
        }, false, user);
        assert.ok(success);
        const savedValue = await getEmployeePropertyValue(employee.employeeNumber, propertyName);
        assert.strictEqual(updatedPropertyValue, savedValue);
    });
    it('Includes the property name in the property names list', async () => {
        const propertyNames = await getEmployeePropertyNames();
        assert.ok(propertyNames.includes(propertyName));
    });
    it('Deletes the property', async () => {
        const success = await deleteEmployeeProperty(employee.employeeNumber, propertyName, user);
        assert.ok(success);
        const employeePropertyValue = await getEmployeePropertyValue(employee.employeeNumber, propertyValue);
        assert.strictEqual(employeePropertyValue, undefined);
        const propertyNames = await getEmployeePropertyNames();
        assert.ok(!propertyNames.includes(propertyName));
    });
});
