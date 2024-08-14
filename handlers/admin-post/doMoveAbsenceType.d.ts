/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { AbsenceType } from '../../types/recordTypes.js';
export interface DoMoveAbsenceTypeResponse {
    success: boolean;
    absenceTypes: AbsenceType[];
}
export declare function doMoveAbsenceTypeDownHandler(request: Request, response: Response): Promise<void>;
export declare function doMoveAbsenceTypeUpHandler(request: Request, response: Response): Promise<void>;
