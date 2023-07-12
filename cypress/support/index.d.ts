import 'cypress-axe';
import type { ConfigTemporaryUserCredentials } from '../../types/configTypes';
export declare const logout: () => void;
export declare const login: (user: ConfigTemporaryUserCredentials) => void;
export declare const ajaxDelayMillis = 800;
