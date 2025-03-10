﻿CREATE TABLE [dbo].[UserHobbies]
(
	[UserHobbyId]           uniqueidentifier    NOT NULL    PRIMARY KEY     DEFAULT NEWID(),
    [UserId]                uniqueidentifier    NULL,
    [Hobby]                 varchar(250)        NULL,
    [CreatedBy]             uniqueidentifier    NULL,
    [CreatedOn]             datetimeoffset      NULL,
    [ModifiedBy]            uniqueidentifier    NULL,
    [ModifiedOn]            datetimeoffset      NULL,
    [IsActive]              bit                 NULL      DEFAULT 1,
)
