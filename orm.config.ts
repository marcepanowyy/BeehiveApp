import { TypeOrmModule } from '@nestjs/typeorm';

export const databaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  // dropSchema: true,
  synchronize: true,
});
