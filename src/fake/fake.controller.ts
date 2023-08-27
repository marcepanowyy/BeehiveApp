import { Controller, Delete, Post } from '@nestjs/common';
import { FakeService } from './fake.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('fake')
export class FakeController {

  constructor(private fakeService: FakeService) {
  }


  @Post()

  @ApiOperation({ summary: 'Generate fake data' })
  @ApiCreatedResponse({ description: 'Fake data generated successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  generateFakeData(){
    return this.fakeService.generate()
  }

  @Delete()

  @ApiOperation({ summary: 'Delete all database data' })
  @ApiNoContentResponse({ description: 'Fake data deleted successfully.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })

  deleteFakeData(){
    return this.fakeService.delete()
  }


}
