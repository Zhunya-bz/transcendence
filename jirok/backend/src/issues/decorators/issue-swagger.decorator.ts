import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  IssueApiErrorResponseDto,
  IssueDetailResponseDto,
  IssueResponseDto,
} from '../dto/issues-swagger.dto';
import { AssignIssueDto } from '../dto/assign-issue.dto';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';
import { UpdateIssueStatusDto } from '../dto/update-issue-status.dto';

export const ApiGetProjectIssues = applyDecorators(
  ApiOperation({ summary: 'List issues for a project' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: IssueResponseDto, isArray: true }),
  ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiGetIssue = applyDecorators(
  ApiOperation({ summary: 'Get one issue by ID' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'issueId', type: Number, example: 42 }),
  ApiOkResponse({ type: IssueDetailResponseDto }),
  ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiCreateIssue = applyDecorators(
  ApiOperation({ summary: 'Create a new issue' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiBody({ type: CreateIssueDto }),
  ApiCreatedResponse({ type: IssueResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiUpdateIssue = applyDecorators(
  ApiOperation({ summary: 'Update an issue' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'issueId', type: Number, example: 42 }),
  ApiBody({ type: UpdateIssueDto }),
  ApiOkResponse({ type: IssueResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: IssueApiErrorResponseDto,
  }),
  ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiUpdateIssueStatus = applyDecorators(
  ApiOperation({ summary: 'Update an issue status' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'issueId', type: Number, example: 42 }),
  ApiBody({ type: UpdateIssueStatusDto }),
  ApiOkResponse({ type: IssueResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: IssueApiErrorResponseDto,
  }),
  ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiAssignIssue = applyDecorators(
  ApiOperation({ summary: 'Assign an issue' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'issueId', type: Number, example: 42 }),
  ApiBody({ type: AssignIssueDto }),
  ApiOkResponse({ type: IssueResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: IssueApiErrorResponseDto,
  }),
  ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);

export const ApiDeleteIssue = applyDecorators(
  ApiOperation({ summary: 'Soft delete an issue' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'issueId', type: Number, example: 42 }),
  ApiOkResponse({ type: IssueResponseDto }),
  ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: IssueApiErrorResponseDto,
  }),
);
