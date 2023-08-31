import { Controller, Delete, Post } from '@nestjs/common';
import { FakeService } from './fake.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { UserRoleEnum } from '../../shared/enums/user.role.enum';
import { Role } from '../../shared/decorators/roles.decorator';

@ApiTags('fake')
@Controller('fake')
export class FakeController {

  constructor(private fakeService: FakeService) {
  }


  @Post()
  @Role(UserRoleEnum.ADMIN)

  @ApiOperation({ summary: 'Generate fake data' })
  @ApiCreatedResponse({ description: 'Fake data generated successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  generateFakeData(){
    return this.fakeService.generate()
  }

  @Delete()
  @Role(UserRoleEnum.ADMIN)

  @ApiOperation({ summary: 'Delete all database data' })
  @ApiNoContentResponse({ description: 'Data deleted successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  deleteFakeData(){
    return this.fakeService.delete()
  }

}
