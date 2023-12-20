import { AvantiApi, lookups as avantiLookups } from '@cityssm/avanti-api';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';
import { createEmployee } from '../database/createEmployee.js';
import { deleteEmployeeProperties } from '../database/deleteEmployeeProperties.js';
import { deleteMissingSyncedEmployees } from '../database/deleteMissingSyncedEmployees.js';
import { getEmployee } from '../database/getEmployee.js';
import { setEmployeeProperty } from '../database/setEmployeeProperty.js';
import { updateEmployee } from '../database/updateEmployee.js';
import { getConfigProperty } from '../helpers/functions.config.js';
const debug = Debug('attendance-tracking:tasks:avantiEmployeeSync');
let terminateTask = false;
const sessionUser = {
    userName: 'sys.employeeSync',
    canLogin: true,
    isAdmin: false
};
const avantiConfig = getConfigProperty('settings.avantiSync.config');
const avanti = avantiConfig === undefined ? undefined : new AvantiApi(avantiConfig);
const getEmployeeOptions = {
    skip: 0,
    take: 10000
};
if (getConfigProperty('settings.avantiSync.locationCodes').length > 0) {
    getEmployeeOptions.locations = getConfigProperty('settings.avantiSync.locationCodes');
}
async function doSync() {
    if (avanti === undefined) {
        return;
    }
    debug('Requesting employees from API...');
    const employees = await avanti.getEmployees(getEmployeeOptions);
    if (!employees.success) {
        debug(employees.error);
        return;
    }
    const syncDateTime = new Date();
    debug(`Processing ${(employees.response.employees?.length ?? 0).toString()} employee(s)...`);
    for (const avantiEmployee of employees.response.employees ?? []) {
        if (terminateTask) {
            break;
        }
        if ((avantiEmployee.empNo ?? '') === '' ||
            !(avantiEmployee.active ?? false)) {
            continue;
        }
        try {
            const currentEmployee = await getEmployee(avantiEmployee.empNo ?? '');
            if (currentEmployee !== undefined &&
                !(currentEmployee.isSynced ?? false)) {
                continue;
            }
            debug(`Processing ${avantiEmployee.empNo ?? ''}...`);
            const newEmployee = {
                employeeNumber: avantiEmployee.empNo ?? '',
                employeeSurname: avantiEmployee.surname ?? '',
                employeeGivenName: avantiEmployee.givenName ?? '',
                userName: '',
                workContact1: '',
                workContact2: '',
                homeContact1: '',
                homeContact2: '',
                jobTitle: avantiEmployee.positionName ?? '',
                department: '',
                isSynced: true,
                syncContacts: true,
                syncDateTime,
                isActive: true
            };
            const avantiEmployeePersonalResponse = await avanti.getEmployeePersonalInfo(avantiEmployee.empNo ?? '');
            if (avantiEmployeePersonalResponse.success) {
                const avantiEmployeePersonal = avantiEmployeePersonalResponse.response;
                newEmployee.seniorityDateTime = new Date(avantiEmployeePersonal.seniorityDate);
                newEmployee.userName = (avantiEmployeePersonal.userName ?? '').toLowerCase();
                const workContacts = [];
                const homeContacts = [];
                for (const phoneTypeIndex of [1, 2, 3, 4]) {
                    if (avantiLookups.phoneTypes[avantiEmployeePersonal[`phoneType${phoneTypeIndex}`]].isPhone &&
                        (avantiEmployeePersonal[`phoneNumber${phoneTypeIndex}`] ?? '') !==
                            '') {
                        if (avantiLookups.phoneTypes[avantiEmployeePersonal[`phoneType${phoneTypeIndex}`]].isWork) {
                            workContacts.push(avantiEmployeePersonal[`phoneNumber${phoneTypeIndex}`]);
                        }
                        else {
                            homeContacts.push(avantiEmployeePersonal[`phoneNumber${phoneTypeIndex}`]);
                        }
                    }
                }
                if (workContacts[0] !== undefined) {
                    newEmployee.workContact1 = workContacts[0];
                }
                if (workContacts[1] !== undefined) {
                    newEmployee.workContact2 = workContacts[1];
                }
                if (homeContacts[0] !== undefined) {
                    newEmployee.homeContact1 = homeContacts[0];
                }
                if (homeContacts[1] !== undefined) {
                    newEmployee.homeContact2 = homeContacts[1];
                }
            }
            currentEmployee === undefined
                ? await createEmployee(newEmployee, sessionUser)
                : await updateEmployee(newEmployee, true, sessionUser);
            await deleteEmployeeProperties(newEmployee.employeeNumber, true, sessionUser);
            if (avantiEmployeePersonalResponse.success) {
                const avantiEmployeePersonal = avantiEmployeePersonalResponse.response;
                await setEmployeeProperty({
                    employeeNumber: newEmployee.employeeNumber,
                    propertyName: 'position',
                    propertyValue: avantiEmployeePersonal.position ?? '',
                    isSynced: true
                }, true, sessionUser);
                await setEmployeeProperty({
                    employeeNumber: newEmployee.employeeNumber,
                    propertyName: 'payGroup',
                    propertyValue: avantiEmployeePersonal.payGroup ?? '',
                    isSynced: true
                }, true, sessionUser);
                await setEmployeeProperty({
                    employeeNumber: newEmployee.employeeNumber,
                    propertyName: 'location',
                    propertyValue: avantiEmployeePersonal.location ?? '',
                    isSynced: true
                }, true, sessionUser);
                await setEmployeeProperty({
                    employeeNumber: newEmployee.employeeNumber,
                    propertyName: 'workGroup',
                    propertyValue: avantiEmployeePersonal.workGroup ?? '',
                    isSynced: true
                }, true, sessionUser);
                for (let otherTextIndex = 1; otherTextIndex <= 20; otherTextIndex += 1) {
                    if (avantiEmployeePersonal[`otherText${otherTextIndex}`] !== '') {
                        await setEmployeeProperty({
                            employeeNumber: newEmployee.employeeNumber,
                            propertyName: `otherText${otherTextIndex}`,
                            propertyValue: avantiEmployeePersonal[`otherText${otherTextIndex}`],
                            isSynced: true
                        }, true, sessionUser);
                    }
                }
            }
        }
        catch (error) {
            debug(error);
        }
    }
    const employeesDeleted = await deleteMissingSyncedEmployees(syncDateTime, sessionUser);
    debug(`${employeesDeleted} employee(s) deleted`);
}
await doSync().catch(() => {
    debug('Error running task.');
});
const intervalID = setIntervalAsync(doSync, 6 * 3600 * 1000);
exitHook(() => {
    terminateTask = true;
    try {
        void clearIntervalAsync(intervalID);
    }
    catch {
        debug('Error exiting task.');
    }
});
