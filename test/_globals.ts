/* eslint-disable node/no-unpublished-import */

import { config } from '../data/config.js'

export const testAdmin = (config.tempUsers ?? []).find((possibleUser) => {
  return possibleUser.user.canLogin && possibleUser.user.isAdmin
})

if (testAdmin === undefined) {
  console.error('No testAdmin user available.')
}

export const testUser = (config.tempUsers ?? []).find((possibleUser) => {
  return (
    possibleUser.user.canLogin &&
    !possibleUser.user.isAdmin &&
    possibleUser.user.permissions['attendance.absences.canUpdate'] === 'true'
  )
})

if (testUser === undefined) {
  console.error('No testUser available')
}

export const portNumber = 7000
