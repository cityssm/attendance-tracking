create schema MonTY
GO

--

create table MonTY.Users (
	userName varchar(20) not null primary key,
	canLogin bit not null default 1,
	canUpdate bit not null default 0,
	isAdmin bit not null default 0,
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2
)
GO
