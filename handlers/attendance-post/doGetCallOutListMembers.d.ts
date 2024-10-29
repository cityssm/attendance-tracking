import type { Request, Response } from 'express';
import type { AbsenceRecord, CallOutListMember, Employee } from '../../types/recordTypes.js';
export interface DoGetCallOutListMembersResponse {
    callOutListMembers: CallOutListMember[];
    availableEmployees: Employee[];
    absenceRecords: AbsenceRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
