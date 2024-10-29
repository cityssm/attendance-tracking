import type { Request, Response } from 'express';
import type { CallOutList } from '../../types/recordTypes.js';
export interface DoToggleFavouriteCallOutListResponse {
    success: boolean;
    callOutLists: CallOutList[];
}
export declare function doAddFavouriteCallOutListHandler(request: Request, response: Response): Promise<void>;
export declare function doRemoveFavouriteCallOutListHandler(request: Request, response: Response): Promise<void>;
