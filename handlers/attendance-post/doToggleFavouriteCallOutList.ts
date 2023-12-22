import type { Request, Response } from 'express'

import { addFavouriteCallOutList } from '../../database/addFavouriteCallOutList.js'
import { getCallOutLists } from '../../database/getCallOutLists.js'
import { removeFavouriteCallOutList } from '../../database/removeFavouriteCallOutList.js'
import type { CallOutList } from '../../types/recordTypes.js'

export interface DoToggleFavouriteCallOutListResponse {
  success: boolean
  callOutLists: CallOutList[]
}

export async function doAddFavouriteCallOutListHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await addFavouriteCallOutList(
    request.body.listId as string,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
  )

  const responseJson: DoToggleFavouriteCallOutListResponse = {
    success,
    callOutLists
  }

  response.json(responseJson)
}

export async function doRemoveFavouriteCallOutListHandler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await removeFavouriteCallOutList(
    request.body.listId as string,
    request.session.user as AttendUser
  )

  const callOutLists = await getCallOutLists(
    { favouriteOnly: false },
    request.session.user as AttendUser
  )

  const responseJson: DoToggleFavouriteCallOutListResponse = {
    success,
    callOutLists
  }

  response.json(responseJson)
}
