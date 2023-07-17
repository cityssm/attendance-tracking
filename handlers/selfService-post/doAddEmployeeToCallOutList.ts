import type { Request, Response } from 'express'

import { addCallOutListMember } from '../../database/addCallOutListMember.js'
import { getCallOutList } from '../../database/getCallOutList.js'
import { getEmployee } from '../../database/getEmployee.js'
import * as configFunctions from '../../helpers/functions.config.js'
import { validateEmployeeFields } from '../../helpers/functions.selfService.js'
import type { Employee } from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  /*
   * Get Employee
   */

  const validatedEmployee = await validateEmployeeFields(request)

  if (!validatedEmployee.success) {
    response.json({
      success: false,
      errorMessage: 'Employee not found'
    })

    return
  }

  const employee = (await getEmployee(
    validatedEmployee.employeeNumber
  )) as Employee

  /*
   * Get Call Out List
   */

  const callOutList = await getCallOutList(request.body.listId)

  if (callOutList === undefined) {
    response.json({
      success: false,
      errorMessage: 'Call out list not found'
    })

    return
  }

  if (!(callOutList.allowSelfSignUp as boolean)) {
    response.json({
      success: false,
      errorMessage: 'Call out list does not allow self sign up'
    })

    return
  }

  if ((callOutList.selfSignUpKey ?? '') !== request.body.selfSignUpKey) {
    response.json({
      success: false,
      errorMessage: 'Call out list access denied'
    })

    return
  }

  /*
   * Check eligibility
   */

  let isEligible = false

  // No eligibility function
  if ((callOutList.eligibilityFunction ?? '') === '') {
    isEligible = true
  } else {
    const eligibilityFunction = configFunctions
      .getProperty('settings.employeeEligibilityFunctions')
      .find((possibleFunction) => {
        return callOutList.eligibilityFunction === possibleFunction.functionName
      })

    // Can't find the eligibility function, skip the list
    if (eligibilityFunction !== undefined) {
      isEligible = eligibilityFunction.eligibilityFunction(
        employee,
        callOutList.employeePropertyName
      )
    }
  }

  let success = false

  if (isEligible) {
    const sessionUser: MonTYUser = {
      userName: employee.employeeNumber,
      canLogin: false,
      isAdmin: false
    }

    success = await addCallOutListMember(
      callOutList.listId,
      employee.employeeNumber,
      sessionUser
    )
  } else {
    response.json({
      success: false,
      errorMessage: 'Employee not eligible to be added to the call out list'
    })

    return
  }

  response.json({
    success
  })
}

export default handler
