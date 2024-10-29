import type { Request, Response } from 'express';
import type { AbsenceType } from '../../types/recordTypes.js';
export interface DoDeleteAbsenceTypeResponse {
    success: boolean;
    absenceTypes: AbsenceType[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
