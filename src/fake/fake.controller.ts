import { Controller, Delete, Post } from '@nestjs/common';
import { FakeService } from './fake.service';

@Controller('fake')
export class FakeController {

  constructor(private fakeService: FakeService) {
  }


  @Post()
  generateFakeData(){
    return this.fakeService.generate()
  }

  @Delete()
  deleteFakeData(){
    return this.fakeService.delete()
  }


}
