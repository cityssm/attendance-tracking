import type * as recordTypes from '../types/recordTypes';
export declare function updateUserCanLogin(userName: string, canLogin: '0' | '1' | 0 | 1 | false | true, requestSession: recordTypes.PartialSession): Promise<boolean>;
