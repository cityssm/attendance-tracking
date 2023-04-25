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

--

create table MonTY.Employees (
	employeeNumber varchar(20) not null primary key,
	employeeSurname nvarchar(100) not null,
	employeeGivenName nvarchar(100) not null,
	contactType1 varchar(20),
	contact1 varchar(100),
	contactType2 varchar(20),
	contact2 varchar(100),
	jobTitle nvarchar(100),
	department nvarchar(100),
	seniorityDateTime datetime2,
	dataField1 nvarchar(200),
	dataField2 nvarchar(200),
	dataField3 nvarchar(200),
	dataField4 nvarchar(200),
	dataField5 nvarchar(200),
	syncDateTime datetime2,
	isActive bit not null default 1,
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2
)
GO

--

create table MonTY.CallOutLists (
	listId bigint primary key identity,
	listName varchar(100) not null,
	sortKeyFunction varchar(100),
	eligibilityFunction varchar(100),
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2
)
GO

create table MonTY.CallOutListMembers (
	listId bigint not null,
	employeeNumber varchar(20) not null,
	sortKey nvarchar(1000),
	isNext bit not null default 0,
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2,
	primary key (listId, employeeNumber),
	foreign key (listId) references MonTY.CallOutLists (listId) on update cascade on delete no action,
	foreign key (employeeNumber) references MonTY.Employees (employeeNumber) on update cascade on delete no action
)
GO

create index idx_calloutlistmembers_sortkey on MonTY.CallOutListMembers (listId, sortKey)
GO

create table MonTY.CallOutResponseTypes (
	responseTypeId smallint primary key identity,
	responseType varchar(100) not null,
	isSuccessful bit not null default 0,
	orderNumber smallint not null default 0,
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2
)
GO

create table MonTY.CallOutRecords (
	recordId bigint primary key identity,
	listId bigint not null,
	employeeNumber varchar(20) not null,
	callOutDateTime datetime2 not null,
	responseTypeId smallint not null,
	recordComment nvarchar(max),
	recordCreate_userName varchar(20) not null,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_datetime datetime2,
	foreign key (listId) references MonTY.CallOutLists (listId) on update cascade on delete no action,
	foreign key (employeeNumber) references MonTY.Employees (employeeNumber) on update cascade on delete no action,
	foreign key (responseTypeId) references MonTY.CallOutResponseTypes (responseTypeId) on update cascade on delete no action
)
GO