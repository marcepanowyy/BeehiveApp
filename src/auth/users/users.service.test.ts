import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { afterEach, beforeEach, describe, it } from 'node:test';
import * as assert from 'node:assert';
import {
  createTestingContainer,
  ITestingContainer,
} from '../../../shared/test/utils';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

process.env.SECRET = 'testing-secret-key-1)IN!@1ine';

describe('UsersService', () => {
  let testingContainer: ITestingContainer;

  beforeEach(async () => {
    testingContainer = await createTestingContainer();
  });

  it('should register in with valid credentials', async () => {
    const userData = {
      username: 'test@user.com',
      password: 'tE$Tp4sSw0rd123',
    };

    const result = await testingContainer.services.usersService.register(userData);
    assert.strictEqual(result.username, userData.username);

  });

  // it('should throw an error when registering with invalid credentials', async () => {
  //
  //   const invalidPasswordData = {
  //     username: 'test@user.com',
  //     password: 'invalidPassword',
  //   };
  //
  //   await assert.rejects(
  //     async () => {
  //       await testingContainer.usersService.register(invalidPasswordData);
  //     },
  //     (err) => {
  //       assert.strictEqual(err instanceof ValidationError, true);
  //       // assert.strictEqual(err.response, 'Validation failed: The password must contain at least one special character, one uppercase letter and two digits');
  //       return true;
  //     }
  //   );
  //
  //   // const invalidUsernameData = {
  //   //   username: 'invalidUsername',
  //   //   password: 'tE$Tp4sSw0rd123',
  //   // };
  //
  //   // await assert.rejects(
  //   //   async () => {
  //   //     await testingContainer.usersService.register(invalidUsernameData);
  //   //   },
  //   //   (err) => {
  //   //     assert.strictEqual(err instanceof HttpException, true);
  //   //     assert.strictEqual(err.response, 'Invalid email address');
  //   //     assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
  //   //     return true
  //   //   }
  //   // );
  //
  // });

  // it('should throw an error when registering when the username is already taken', async () => {
  //   const userData = {
  //     username: 'test@user.com',
  //     password: 'tE$Tp4sSw0rd123',
  //   };
  //
  //   await testingContainer.usersService.register(userData);
  //
  //   await assert.rejects(
  //     async () => {
  //       await testingContainer.usersService.register(userData);
  //     },
  //     err => {
  //       assert.strictEqual(err instanceof HttpException, true);
  //       assert.strictEqual(err.response, 'User already exists');
  //       assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
  //       return true;
  //     },
  //   );
  // });

  // it('should log in user with valid credentials', async () => {
  //   const userData = {
  //     username: 'test@user.com',
  //     password: 'tE$Tp4sSw0rd123',
  //   };
  //
  //   await testingContainer.usersService.register(userData);
  //   const result = await testingContainer.usersService.login(userData);
  //
  //   assert.strictEqual(result.username, userData.username);
  // });

  // it('should throw an error when logging in with invalid credentials', async () => {
  //   const userData = {
  //     username: 'test@user.com',
  //     password: 'tE$Tp4sSw0rd123',
  //   };
  //
  //   await testingContainer.usersService.register(userData);
  //
  //   const invalidUserData = {
  //     username: 'tessssst@user.com',
  //     password: 'tE$Tp4sSw0rd123',
  //   };
  //
  //   await assert.rejects(
  //     async () => {
  //       await testingContainer.usersService.login(invalidUserData);
  //     },
  //     err => {
  //       assert.strictEqual(err instanceof HttpException, true);
  //       assert.strictEqual(err.response, 'Invalid username or password');
  //       assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
  //       return true;
  //     },
  //   );
  // });
});
