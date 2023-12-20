import { Configurator } from '@cityssm/configurator';
import { config } from '../data/config.js';
import { configDefaultValues } from '../data/configDefaultValues.js';
const property_session_maxAgeMillis = 'session.maxAgeMillis';
const configurator = new Configurator(configDefaultValues, config);
export function getConfigProperty(propertyName, fallbackValue) {
    return configurator.getConfigProperty(propertyName, fallbackValue);
}
export const isLogoOverwritten = configurator.isDefaultValueOverwritten('application.bigLogoURL') ||
    configurator.isDefaultValueOverwritten('application.smallLogoURL');
export function includeAttendance() {
    return (getConfigProperty('features.attendance.absences') ||
        getConfigProperty('features.attendance.callOuts') ||
        getConfigProperty('features.attendance.returnsToWork'));
}
export const historicalDays = getConfigProperty('settings.recentDays') * 3;
export const deleteDays = historicalDays * 3;
export const keepAliveMillis = getConfigProperty('session.doKeepAlive')
    ? Math.max(getConfigProperty(property_session_maxAgeMillis) / 2, getConfigProperty(property_session_maxAgeMillis) - 10 * 60 * 1000)
    : 0;
export default {
    getConfigProperty,
    includeAttendance,
    isLogoOverwritten,
    historicalDays,
    deleteDays,
    keepAliveMillis
};
