import 'cypress-axe';
import type * as configTypes from '../../types/configTypes';
export declare const logout: () => void;
export declare const login: (user: configTypes.ConfigTemporaryUserCredentials) => void;
export declare const ajaxDelayMillis = 800;
