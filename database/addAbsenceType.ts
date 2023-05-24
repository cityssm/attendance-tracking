import camelCase from 'camelcase'
import crypto from 'node:crypto'

import * as configFunctions from '../helpers/functions.config.js'

import * as sqlPool from '@cityssm/mssql-multi-pool'

import type * as recordTypes from '../types/recordTypes.js'

interface AddAbsenceTypeForm {
  absenceType: string
}

export async function addAbsenceType(
  form: AddAbsenceTypeForm,
  requestSession: recordTypes.PartialSession
): Promise<string> {
  let absenceTypeKey = await getAvailableAbsenceTypeKey(form.absenceType)

  while (absenceTypeKey === '') {
    absenceTypeKey = await getAvailableAbsenceTypeKey(crypto.randomUUID())
  }

  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  await pool
    .request()
    .input('absenceTypeKey', absenceTypeKey)
    .input('absenceType', form.absenceType)
    .input('orderNumber', -1)
    .input('record_userName', requestSession.user?.userName)
    .input('record_dateTime', new Date()).query(`insert into MonTY.AbsenceTypes
      (absenceTypeKey, absenceType, orderNumber,
        recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)
      values (@absenceTypeKey, @absenceType, @orderNumber,
        @record_userName, @record_dateTime, @record_userName, @record_dateTime)`)

  return absenceTypeKey
}

async function getAvailableAbsenceTypeKey(
  absenceType: string
): Promise<string> {
  const absenceTypeKeyRoot = camelCase(absenceType).slice(0, 10)

  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  for (let index = 0; index <= 9_999_999_999; index += 1) {
    const indexString = index.toString()

    const absenceTypeKey =
      index === 0
        ? absenceTypeKeyRoot
        : absenceTypeKeyRoot.slice(0, 10 - indexString.length) + indexString

    const result = await pool.request().input('absenceTypeKey', absenceTypeKey)
      .query(`select absenceTypeKey
        from MonTY.AbsenceTypes
        where absenceTypeKey = @absenceTypeKey`)

    if (result.recordset.length === 0) {
      return absenceTypeKey
    }
  }

  return ''
}
