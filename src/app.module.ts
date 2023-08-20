import { Module } from '@nestjs/common';
import { MessageHandlerModule } from './message.handler/message.handler.module';

@Module({
  imports: [MessageHandlerModule],
  controllers: [],
})
export class AppModule {}
