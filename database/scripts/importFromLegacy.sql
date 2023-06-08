truncate table MonTY.AbsenceRecords
GO

truncate table MonTY.HistoricalAbsenceRecords
GO

insert into MonTY.AbsenceRecords
(employeeNumber, employeeName, absenceDateTime, absenceTypeKey, recordComment, returnDateTime, recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)

select '0000' + Employee_Number, Employee_FullName, Absence_Date, Absence_ReasonKey, Absence_Notes, Return_ApproxDate, RecordCreate_Name, RecordCreate_Time, RecordUpdate_Name, RecordUpdate_Time
from AbsenceTracking.Form_Absence
where RecordDelete_Time is null
GO

---

truncate table MonTY.ReturnToWorkRecords
GO

truncate table MonTY.HistoricalReturnToWorkRecords
GO

insert into MonTY.ReturnToWorkRecords
(employeeNumber, employeeName, returnDateTime, returnShift, recordComment, recordCreate_userName, recordCreate_dateTime, recordUpdate_userName, recordUpdate_dateTime)

select '0000' + Employee_Number, Employee_FullName, Return_Date, Return_Shift, '', RecordCreate_Name, RecordCreate_Time, RecordUpdate_Name, RecordUpdate_Time
from AbsenceTracking.Form_ReturnToWork
where RecordDelete_Time is null
GO