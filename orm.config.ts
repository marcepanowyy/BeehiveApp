import { TypeOrmModule } from '@nestjs/typeorm';

import 'dotenv/config';

export const databaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [process.env.DB_ENTITIES],
  // dropSchema: true,
  synchronize: true,
});
