import type * as recordTypes from '../types/recordTypes.js';
export declare function updateUserIsAdmin(userName: string, isAdmin: '0' | '1' | 0 | 1 | false | true, requestSession: recordTypes.PartialSession): Promise<boolean>;
