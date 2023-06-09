import './polyfills.js';
import { config } from '../data/config.js';
const configFallbackValues = new Map();
configFallbackValues.set('application.applicationName', 'MonTY');
configFallbackValues.set('application.backgroundURL', '/images/truck-background.jpg');
configFallbackValues.set('application.bigLogoURL', '/images/monty-big.svg');
configFallbackValues.set('application.smallLogoURL', '/images/monty-small.svg');
configFallbackValues.set('application.httpPort', 7000);
configFallbackValues.set('application.maximumProcesses', 4);
configFallbackValues.set('tempUsers', []);
configFallbackValues.set('reverseProxy.disableCompression', false);
configFallbackValues.set('reverseProxy.disableEtag', false);
configFallbackValues.set('reverseProxy.urlPrefix', '');
configFallbackValues.set('session.cookieName', 'monty-user-sid');
configFallbackValues.set('session.secret', 'cityssm/monty');
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000);
configFallbackValues.set('session.doKeepAlive', false);
configFallbackValues.set('features.attendance.absences', true);
configFallbackValues.set('features.attendance.callOuts', true);
configFallbackValues.set('features.attendance.returnsToWork', true);
configFallbackValues.set('features.attendance.afterHours', true);
configFallbackValues.set('features.employees.avantiSync', false);
configFallbackValues.set('features.selfService', false);
configFallbackValues.set('settings.avantiSync.locationCodes', []);
configFallbackValues.set('settings.employeeEligibilityFunctions', []);
configFallbackValues.set('settings.employeeSortKeyFunctions', []);
configFallbackValues.set('settings.printPdf.contentDisposition', 'attachment');
configFallbackValues.set('settings.recentDays', 10);
configFallbackValues.set('settings.updateDays', 5);
configFallbackValues.set('settings.selfService.path', '/selfService');
export function getProperty(propertyName) {
    const propertyNameSplit = propertyName.split('.');
    let currentObject = config;
    for (const propertyNamePiece of propertyNameSplit) {
        if (Object.hasOwn(currentObject, propertyNamePiece)) {
            currentObject = currentObject[propertyNamePiece];
            continue;
        }
        return configFallbackValues.get(propertyName);
    }
    return currentObject;
}
export function includeAttendance() {
    return (getProperty('features.attendance.absences') ||
        getProperty('features.attendance.callOuts') ||
        getProperty('features.attendance.returnsToWork'));
}
export const keepAliveMillis = getProperty('session.doKeepAlive')
    ? Math.max(getProperty('session.maxAgeMillis') / 2, getProperty('session.maxAgeMillis') - 10 * 60 * 1000)
    : 0;
