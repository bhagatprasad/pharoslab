CREATE TABLE [dbo].[User]
(
	[Id]                    uniqueidentifier    NOT NULL    PRIMARY KEY     DEFAULT NEWID(),
    [FirstName]             varchar(250)        NULL,
    [LastName]              varchar(250)        NULL,
    [Email]                 varchar(250)        NULL,
    [Phone]                 varchar(14)         NULL,
    [PasswordHash]          nvarchar(max)       NULL,
    [PasswordSalt]          nvarchar(max)       NULL,
    [LastPasswordChangedOn] datetimeoffset      NULL,
    [IsBlocked]             bit                 NULL      DEFAULT 0,
    [CreatedBy]             uniqueidentifier    NULL,
    [CreatedOn]             datetimeoffset      NULL,
    [ModifiedBy]            uniqueidentifier    NULL,
    [ModifiedOn]            datetimeoffset      NULL,
    [IsActive]              bit                 NULL      DEFAULT 1,
)
