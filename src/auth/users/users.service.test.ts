import { UsersService } from './users.service';
import { before, beforeEach, describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import {
  clearDataBaseData,
  createTestingContainer,
  ITestingContainer,
} from '../../../shared/test/utils';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {

  let testingContainer: ITestingContainer;

  let userData, invalidUserData

  before(async () => {
    testingContainer = await createTestingContainer();
  });

  beforeEach(async () => {

    await clearDataBaseData(testingContainer);

    userData = {
      username: 'test@user.com',
      password: 'tE$Tp4sSw0rd123',
    };

    invalidUserData = {
      username: 'test@user.com',
      password: 'tttE$Tp4sSw0rd123',
    };

  });

  it('should register in with valid credentials', async () => {

    const result = await testingContainer.services.usersService.register({
      ...userData,
    });

    const user = await testingContainer.repositories.usersRepository.findOne({
      where: { username: userData.username },
    });

    assert.strictEqual(result.id, user.id);
    assert.strictEqual(result.username, user.username);
  });

  it('should throw an error when registering when the username is already taken', async () => {

    const user = testingContainer.repositories.usersRepository.create({
      ...userData,
    });
    await testingContainer.repositories.usersRepository.save(user);

    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.register({ ...userData });
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'User already exists');
        assert.strictEqual(err.status, HttpStatus.BAD_REQUEST);
        return true;
      },
    );
  });

  it('should log in user with valid credentials', async () => {

    const user = testingContainer.repositories.usersRepository.create({
      ...userData,
    });

    await testingContainer.repositories.usersRepository.save(user);

    const result = await testingContainer.services.usersService.login({ ...userData });

    assert.strictEqual(result.username, userData.username);
  });

  it('should throw an error when logging in with invalid credentials', async () => {

    const user = testingContainer.repositories.usersRepository.create({
      ...userData,
    });
    await testingContainer.repositories.usersRepository.save(user);

    await assert.rejects(
      async () => {
        await testingContainer.services.usersService.login({ ...invalidUserData });
      },
      (err: any) => {
        assert.strictEqual(err instanceof HttpException, true);
        assert.strictEqual(err.response, 'Invalid username or password');
        assert.strictEqual(err.status, HttpStatus.UNAUTHORIZED);
        return true;
      },
    );
  });
});
