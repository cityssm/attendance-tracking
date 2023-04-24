import './polyfills.js';
import { config } from '../data/config.js';
const configFallbackValues = new Map();
configFallbackValues.set('application.applicationName', 'MonTY');
configFallbackValues.set('application.backgroundURL', '/images/truck-background.jpg');
configFallbackValues.set('application.logoURL', '/images/hardhat.svg');
configFallbackValues.set('application.httpPort', 7000);
configFallbackValues.set('application.maximumProcesses', 4);
configFallbackValues.set('reverseProxy.disableCompression', false);
configFallbackValues.set('reverseProxy.disableEtag', false);
configFallbackValues.set('reverseProxy.urlPrefix', '');
configFallbackValues.set('session.cookieName', 'monty-user-sid');
configFallbackValues.set('session.secret', 'cityssm/monty');
configFallbackValues.set('session.maxAgeMillis', 60 * 60 * 1000);
configFallbackValues.set('session.doKeepAlive', false);
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
export const keepAliveMillis = getProperty('session.doKeepAlive')
    ? Math.max(getProperty('session.maxAgeMillis') / 2, getProperty('session.maxAgeMillis') - 10 * 60 * 1000)
    : 0;
