import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateIssueDto } from './create-issue.dto';

export class UpdateIssueDto extends PartialType(
  OmitType(CreateIssueDto, ['reporterId'] as const),
) {}
