import type * as recordTypes from '../types/recordTypes';
export declare function updateUserIsAdmin(userName: string, isAdmin: '0' | '1' | 0 | 1 | false | true, sessionUser: recordTypes.User): Promise<boolean>;
