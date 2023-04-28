create schema MonTY
GO

--

create table MonTY.Users (
	userName varchar(20) not null primary key,
	canLogin bit not null default 1,
	isAdmin bit not null default 0,
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2
)
GO

insert into MonTY.Users (userName, canLogin, isAdmin)
values ('administrator', 1, 1)
GO

create table MonTY.UserPermissions (
	userName varchar(20) not null,
	permissionKey varchar(50) not null,
	permissionValue nvarchar(500),
	primary key (userName, permissionKey),
	foreign key (userName) references MonTY.Users (userName) on update cascade on delete cascade
)
GO

--

create table MonTY.Employees (
	employeeNumber varchar(20) not null primary key,
	employeeSurname nvarchar(100) not null,
	employeeGivenName nvarchar(100) not null,
	userName varchar(20),
	workContact1 varchar(100),
	workContact2 varchar(100),
	homeContact1 varchar(100),
	homeContact2 varchar(100),
	syncContacts bit not null default 0,
	jobTitle nvarchar(100),
	department nvarchar(100),
	seniorityDateTime datetime2,
	isSynced bit not null default 0,
	syncDateTime datetime2,
	isActive bit not null default 1,
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2
)
GO

create table MonTY.EmployeeProperties (
	employeeNumber varchar(20) not null,
	propertyName varchar(100) not null,
	propertyValue nvarchar(500),
	isSynced bit not null default 0,
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2,
	primary key (employeeNumber, propertyName),
	foreign key (employeeNumber) references MonTY.Employees (employeeNumber) on update cascade on delete cascade
)
GO

--

create table MonTY.CallOutLists (
	listId bigint primary key identity,
	listName varchar(100) not null,
	listDescription varchar(500),
	sortKeyFunction varchar(100),
	eligibilityFunction varchar(100),
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2
)
GO

create table MonTY.CallOutListMembers (
	listId bigint not null,
	employeeNumber varchar(20) not null,
	sortKey nvarchar(500),
	isNext bit not null default 0,
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2,
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
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2
)
GO

create table MonTY.CallOutRecords (
	recordId bigint primary key identity,
	listId bigint not null,
	employeeNumber varchar(20) not null,
	callOutDateTime datetime2 not null,
	callOutHours numeric(5, 2) not null default 0,
	responseTypeId smallint not null,
	recordComment nvarchar(max),
	recordCreate_userName varchar(20) not null default CURRENT_USER,
	recordCreate_dateTime datetime2 not null default getdate(),
	recordUpdate_userName varchar(20) not null default CURRENT_USER,
	recordUpdate_dateTime datetime2 not null default getdate(),
	recordDelete_userName varchar(20),
	recordDelete_dateTime datetime2,
	foreign key (listId) references MonTY.CallOutLists (listId) on update cascade on delete no action,
	foreign key (employeeNumber) references MonTY.Employees (employeeNumber) on update cascade on delete no action,
	foreign key (responseTypeId) references MonTY.CallOutResponseTypes (responseTypeId) on update cascade on delete no action
)
GO