import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mailing')
@Controller('mailing')

export class MailingController {}
