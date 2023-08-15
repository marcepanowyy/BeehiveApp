import { Module } from '@nestjs/common';
import { FakeController } from './fake.controller';
import { FakeService } from './fake.service';

@Module({
  controllers: [FakeController],
  providers: [FakeService]
})
export class FakeModule {}
