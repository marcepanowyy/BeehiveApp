// import { before, describe, it } from 'node:test';
// import {
//   createTestingContainer,
//   ITestingContainer,
// } from '../../../shared/test/utils';
// import { UsersDto } from './users.dto';
// import { validate } from 'class-validator';
// import { strict as assert } from 'node:assert';
//
// describe("UsersDTO (Users' Data Transfer Object)", () => {
//   let testingContainer: ITestingContainer;
//   let testCredentials;
//
//   before(async () => {
//     testingContainer = await createTestingContainer();
//     testCredentials = require('../../../shared/test/samples/usersSample');
//   });
//
//   it('should validate valid credentials', async () => {
//     for (const user of testCredentials.valid) {
//       const usersDto = new UsersDto();
//       usersDto.username = user.username;
//       usersDto.password = user.password;
//
//       const errors = await validate(usersDto);
//       assert.strictEqual(errors.length, 0);
//     }
//   });
//
//   it('should validate invalid usernames', async () => {
//     for (const user of testCredentials.invalid.usernames) {
//       const usersDto = new UsersDto();
//       usersDto.username = user.username;
//       usersDto.password = user.password;
//
//       const errors = await validate(usersDto);
//       assert.strictEqual(errors.length > 0, true);
//     }
//   });
//
//   it('should validate invalid passwords', async () => {
//     for (const user of testCredentials.invalid.passwords) {
//       const usersDto = new UsersDto();
//       usersDto.username = user.username;
//       usersDto.password = user.password;
//
//       const errors = await validate(usersDto);
//       assert.strictEqual(errors.length > 0, true);
//     }
//   });
//
//   it('should validate invalid credentials', async () => {
//     for (const user of testCredentials.invalid.both) {
//       const usersDto = new UsersDto();
//       usersDto.username = user.username;
//       usersDto.password = user.password;
//
//       const errors = await validate(usersDto);
//       assert.strictEqual(errors.length > 0, true);
//     }
//   });
// });
