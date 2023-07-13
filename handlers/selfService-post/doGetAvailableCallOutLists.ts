import type { Request, Response } from 'express'

import { getEmployee } from '../../database/getEmployee.js'
import { getSelfSignUpCallOutLists } from '../../database/getSelfSignUpCallOutLists.js'
import * as configFunctions from '../../helpers/functions.config.js'
import { validateEmployeeFields } from '../../helpers/functions.selfService.js'
import type { CallOutList } from '../../types/recordTypes.js'

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

  const employee = (await getEmployee(validatedEmployee.employeeNumber))!

  /*
   * Get Call Out Lists
   */

  const eligibilityFunctions = configFunctions.getProperty(
    'settings.employeeEligibilityFunctions'
  )

  const availableCallOutLists = await getSelfSignUpCallOutLists({
    doesNotHaveEmployeeNumber: employee.employeeNumber
  })

  const callOutLists: CallOutList[] = []

  for (const callOutList of availableCallOutLists) {
    // No eligibility function, add to list
    if ((callOutList.eligibilityFunction ?? '') === '') {
      callOutLists.push(callOutList)
    }

    const eligibilityFunction = eligibilityFunctions.find(
      (possibleFunction) => {
        return callOutList.eligibilityFunction === possibleFunction.functionName
      }
    )

    // Can't find the eligibility function, skip the list
    if (eligibilityFunction === undefined) {
      continue
    }

    const isEligible = eligibilityFunction.eligibilityFunction(
      employee,
      callOutList.employeePropertyName
    )

    if (isEligible) {
      callOutLists.push(callOutList)
    }
  }

  response.json({
    callOutLists
  })
}

export default handler
